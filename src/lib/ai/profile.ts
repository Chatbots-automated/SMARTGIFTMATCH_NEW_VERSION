import "server-only";
import { createHash } from "node:crypto";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";
import type { Product } from "../types";
import { INTERESTS } from "../options";
import { CHAT_MODEL, openai } from "./openai";

const RELATIONSHIPS = ["partner", "parent", "sibling", "friend", "child", "grandparent", "colleague", "boss", "date", "flatmate", "neighbour"] as const;
const VIBES = ["practical", "sentimental", "fun", "luxury", "cosy", "experiential", "creative", "techy", "quirky"] as const;

/** What the AI writes once per product. Stored in product_ai_profiles.profile. */
export const GiftProfile = z.object({
  summary: z.string().describe("What it is in plain words, max 15 words"),
  recipient: z.enum(["human", "pet"]),
  pet_types: z.array(z.enum(["dog", "cat", "other"])).describe("Empty for human gifts"),
  ideal_for: z.array(z.string()).describe("3-6 short personas who would love it, e.g. 'home baristas', 'new dog owners'"),
  interests: z.array(z.enum(INTERESTS.map((i) => i.value) as [string, ...string[]])).describe("Matching interests from the list, 0-3"),
  age_min: z.number().nullable().describe("Youngest suitable age in years (human) or null if any"),
  age_max: z.number().nullable().describe("Oldest age in years it still makes sense for, or null"),
  genders: z.array(z.enum(["any", "male", "female"])).describe("['any'] unless clearly gendered"),
  relationships: z.array(z.enum(RELATIONSHIPS)).describe("Givers' relationships for which this gift is appropriate"),
  occasions: z.array(z.string()).describe("2-6 occasions it genuinely suits"),
  vibe: z.array(z.enum(VIBES)).describe("1-3"),
  not_for: z.array(z.string()).describe("Who should NOT get this, e.g. 'children under 3', 'people without a garden'"),
});
export type GiftProfile = z.infer<typeof GiftProfile>;

const FX_TO_EUR: Record<string, number> = { EUR: 1, USD: 0.92, GBP: 1.17 };

export function priceEur(p: Pick<Product, "price" | "currency">) {
  if (p.price == null) return null;
  return Math.round(Number(p.price) * (FX_TO_EUR[p.currency ?? "EUR"] ?? 1) * 100) / 100;
}

/** Changes whenever anything the profile depends on changes. */
export function sourceHash(p: Product) {
  return createHash("sha256")
    .update(JSON.stringify([p.title, p.description, p.category, p.price, p.currency, p.product_form, CHAT_MODEL, 1]))
    .digest("hex");
}

const SYSTEM = `You catalogue gifts for SmartGiftMatch, a gift recommendation site.
Given one product, describe honestly who would be delighted to receive it. Be specific and realistic: base everything on what the product is, not on marketing claims.
The shop's own tags (occasions, ages, regions) are often over-inclusive. Use them as hints only.`;

export async function buildProfile(p: Product): Promise<GiftProfile> {
  if (!openai) throw new Error("OPENAI_API_KEY is not set");
  const f = p.product_form ?? {};
  const input = [
    `Title: ${p.title.trim()}`,
    `Category: ${[p.category, ...(f.secondary_categories ?? [])].filter(Boolean).join(", ")}`,
    `Price: ${p.price ?? "unknown"} ${p.currency ?? ""}`,
    `Description: ${p.description ?? "(none)"}`,
    `Shop tags — recipient: ${f.recipient_type || "?"}; targeting: ${(f.gender_targeting ?? []).join(", ") || "?"}; ages: ${(f.age_brackets ?? []).join(", ") || "?"}; occasions: ${(f.occasions ?? []).slice(0, 12).join(", ") || "?"}`,
  ].join("\n");

  const res = await openai.responses.parse({
    model: CHAT_MODEL,
    reasoning: { effort: "low" },
    instructions: SYSTEM,
    input,
    text: { format: zodTextFormat(GiftProfile, "gift_profile") },
  });
  if (!res.output_parsed) throw new Error(`No profile returned for ${p.slug}`);
  return res.output_parsed;
}

/** The text we embed. Written in the same voice as the search query so the vectors line up. */
export function profileEmbeddingText(p: Product, g: GiftProfile) {
  return [
    `${p.title.trim()}: ${g.summary}`,
    `Perfect for ${g.ideal_for.join(", ")}.`,
    g.interests.length ? `Interests: ${g.interests.join(", ")}.` : "",
    `Occasions: ${g.occasions.join(", ")}.`,
    `Vibe: ${g.vibe.join(", ")}.`,
    g.recipient === "pet" ? `For pets: ${g.pet_types.join(", ")}.` : "",
  ]
    .filter(Boolean)
    .join(" ");
}
