import { z } from "zod";
import { getProducts } from "@/lib/data";
import { findGifts } from "@/lib/ai/finder";

const short = z.string().max(60).optional();

const Body = z.object({
  answers: z.object({
    recipientType: z.enum(["human", "pet"]),
    relation: short,
    gender: short,
    ageRange: short,
    interests: z.array(z.string().max(40)).max(6).optional(),
    petType: short,
    petAge: short,
    occasion: short,
    budget: short,
    region: short,
    notes: z.string().max(400).optional(),
  }),
  exclude: z.array(z.string().max(64)).max(200).optional(),
});

// Light per-instance throttle so the AI endpoint can't be hammered for free.
const hits = new Map<string, number[]>();
function throttled(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 12;
}

export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
  const { answers, exclude = [] } = parsed.data;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";

  const body = await findGifts(await getProducts(), answers, exclude, { allowAi: !throttled(ip) });
  return Response.json(body);
}
