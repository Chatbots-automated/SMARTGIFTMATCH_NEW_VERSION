import type { Product } from "./types";

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);

const PET_MARKERS = ["Dog", "Cat"];

export function isPetProduct(p: Product) {
  const f = p.product_form;
  if (f?.recipient_type === "pet") return true;
  if (f?.recipient_type === "human") return false;
  return p.category === "Pet Supplies" || !!f?.gender_targeting?.some((g) => PET_MARKERS.includes(g));
}

const SYMBOLS: Record<string, string> = { EUR: "€", USD: "$", GBP: "£" };

export function formatPrice(p: Pick<Product, "price" | "currency">) {
  if (p.price == null) return null;
  const symbol = SYMBOLS[p.currency ?? "EUR"] ?? `${p.currency} `;
  return `${symbol}${Number(p.price).toFixed(2).replace(/\.00$/, "")}`;
}

/** Share of positive community votes, 0–1, or null when there are none. */
export function approval(p: Product) {
  const good = p.reviews?.good ?? 0;
  const bad = p.reviews?.bad ?? 0;
  const total = good + bad;
  return total ? good / total : null;
}

export function plainExcerpt(text: string | null | undefined, max = 155) {
  if (!text) return "";
  const clean = text.replace(/\*\*|__|#+\s|\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…` : clean;
}

export function outboundUrl(p: Pick<Product, "slug">) {
  return `/go/${p.slug}`;
}
