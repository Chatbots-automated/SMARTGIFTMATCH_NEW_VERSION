"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { BUDGETS } from "@/lib/options";
import { PRODUCT_GRID, ProductCard } from "./ProductCard";

export function GiftBrowser({ products, categories }: { products: Product[]; categories: { name: string; slug: string; count: number }[] }) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [budget, setBudget] = useState("any");
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc" | "new">("featured");

  // Support /all-gifts?q=… (sitelinks search box) without making the page dynamic.
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of ?q= after hydration keeps the page static
    if (initial) setQ(initial);
  }, []);

  const shown = useMemo(() => {
    const b = BUDGETS.find((x) => x.value === budget)!;
    const term = q.trim().toLowerCase();
    const list = products.filter(
      (p) =>
        (!category || p.category === category) &&
        (p.price == null || (p.price >= b.min && p.price <= b.max)) &&
        (!term || `${p.title} ${p.description ?? ""} ${p.category ?? ""}`.toLowerCase().includes(term)),
    );
    const by = {
      featured: (a: Product, z: Product) => Number(!!z.editors_choice) - Number(!!a.editors_choice) || (z.reviews?.good ?? 0) - (a.reviews?.good ?? 0),
      "price-asc": (a: Product, z: Product) => (a.price ?? 0) - (z.price ?? 0),
      "price-desc": (a: Product, z: Product) => (z.price ?? 0) - (a.price ?? 0),
      new: (a: Product, z: Product) => z.created_at.localeCompare(a.created_at),
    }[sort];
    return [...list].sort(by);
  }, [products, q, category, budget, sort]);

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search gifts — e.g. watch, cat, coffee"
          aria-label="Search gifts"
          className="w-full rounded-full border border-line bg-white px-5 py-3 text-[15px] focus:border-brand focus:outline-none"
        />
        <select value={budget} onChange={(e) => setBudget(e.target.value)} aria-label="Budget" className="rounded-full border border-line bg-white px-4 py-3 text-[15px]">
          {BUDGETS.map((b) => <option key={b.value} value={b.value}>{b.value === "any" ? "Any budget" : b.label}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Sort" className="rounded-full border border-line bg-white px-4 py-3 text-[15px]">
          <option value="featured">Featured</option>
          <option value="new">Newest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => setCategory(null)} aria-pressed={!category} className="rounded-full border border-line bg-white px-4 py-1.5 text-sm font-medium aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper">
          All
        </button>
        {categories.map((c) => (
          <button key={c.slug} onClick={() => setCategory(category === c.name ? null : c.name)} aria-pressed={category === c.name} className="rounded-full border border-line bg-white px-4 py-1.5 text-sm font-medium aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper">
            {c.name} <span className="opacity-60">{c.count}</span>
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-muted" aria-live="polite">{shown.length} gifts</p>
      <div className={`mt-4 ${PRODUCT_GRID}`}>
        {shown.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 3} />)}
      </div>
      {!shown.length && (
        <p className="mt-10 text-center text-muted">
          Nothing matches that yet. <Link href="/gift-finder" className="font-semibold text-brand">Try the gift finder</Link> instead.
        </p>
      )}

      {/* Crawlable category links */}
      <nav aria-label="Gift categories" className="mt-14 border-t border-line pt-8">
        <h2 className="text-sm font-semibold">Browse by category</h2>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          {categories.map((c) => (
            <li key={c.slug}><Link href={`/gifts/${c.slug}`} className="text-[15px] text-muted hover:text-brand">{c.name} gifts</Link></li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
