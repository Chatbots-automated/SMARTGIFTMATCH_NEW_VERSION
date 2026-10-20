import "server-only";
import type { Product } from "../types";
import { slugify } from "../product";
import { supabaseAdmin } from "../supabase-admin";
import { CHAT_MODEL, embed } from "./openai";
import { buildProfile, priceEur, profileEmbeddingText, sourceHash } from "./profile";

const PRODUCT_COLUMNS =
  "id,title,slug,description,image_url,affiliate_url,category,price,currency,editors_choice,partners_offer,product_form,reviews,created_at,updated_at";

/**
 * Builds AI profiles + embeddings for approved products that are new or changed,
 * and removes profiles of products that are no longer approved.
 */
export async function syncGiftProfiles({ limit = 50, force = false } = {}) {
  const db = supabaseAdmin();
  const [{ data: products, error }, { data: existing, error: e2 }] = await Promise.all([
    db.from("products").select(PRODUCT_COLUMNS).eq("status", "approved"),
    db.from("product_ai_profiles").select("product_id,source_hash"),
  ]);
  if (error) throw new Error(error.message);
  if (e2) throw new Error(`${e2.message} — did you run the product_ai_profiles migration?`);

  const known = new Map(existing!.map((r) => [r.product_id as string, r.source_hash as string]));
  const approved = (products as Product[]).map((p) => ({ ...p, slug: p.slug || slugify(p.title) }));
  const stale = approved.filter((p) => force || known.get(p.id) !== sourceHash(p)).slice(0, limit);

  const removed = [...known.keys()].filter((id) => !approved.some((p) => p.id === id));
  if (removed.length) await db.from("product_ai_profiles").delete().in("product_id", removed);

  const failed: { slug: string; error: string }[] = [];
  let updated = 0;

  // Small batches: profiles in parallel, then one embeddings call per batch.
  for (let i = 0; i < stale.length; i += 8) {
    const batch = stale.slice(i, i + 8);
    const results = await Promise.allSettled(batch.map((p) => buildProfile(p)));
    const ok = batch
      .map((p, j) => ({ p, r: results[j] }))
      .filter((x): x is { p: Product; r: PromiseFulfilledResult<Awaited<ReturnType<typeof buildProfile>>> } => {
        if (x.r.status === "rejected") failed.push({ slug: x.p.slug, error: String(x.r.reason) });
        return x.r.status === "fulfilled";
      });
    if (!ok.length) continue;

    const vectors = await embed(ok.map(({ p, r }) => profileEmbeddingText(p, r.value)));
    const rows = ok.map(({ p, r }, j) => ({
      product_id: p.id,
      profile: r.value,
      embedding: JSON.stringify(vectors[j]),
      price_eur: priceEur(p),
      recipient: r.value.recipient,
      source_hash: sourceHash(p),
      model: CHAT_MODEL,
      updated_at: new Date().toISOString(),
    }));
    const { error: upErr } = await db.from("product_ai_profiles").upsert(rows);
    if (upErr) throw new Error(upErr.message);
    updated += rows.length;
  }

  return {
    approved: approved.length,
    updated,
    removed: removed.length,
    remaining: Math.max(0, approved.filter((p) => force || known.get(p.id) !== sourceHash(p)).length - stale.length),
    failed,
  };
}
