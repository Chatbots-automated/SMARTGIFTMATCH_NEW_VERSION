"use client";

import Image from "next/image";
import Link from "next/link";
import type { GiftPick, MatchResponse } from "@/lib/types";
import { formatPrice, outboundUrl } from "@/lib/product";
import { ProductCard } from "../ProductCard";

const BADGES = ["🏆 Best match", "💡 Great alternative", "✨ Wildcard"];

export function Results({ result, onShuffle, onRestart, onEdit }: { result: MatchResponse; onShuffle: () => void; onRestart: () => void; onEdit: () => void }) {
  if (!result.picks.length) {
    return (
      <div className="rounded-[2rem] border border-line bg-white p-10 text-center shadow-soft">
        <p className="h-display text-3xl">We&apos;ve shown you everything that fits!</p>
        <p className="mt-3 text-muted">Try loosening your budget, or browse the full collection.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button className="btn-dark" onClick={onEdit}>Change answers</button>
          <Link className="btn-ghost" href="/all-gifts">Browse all gifts</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-rise">
      <p className="eyebrow">{result.aiUsed ? "Picked for them by our AI gift expert" : "Your matches"}</p>
      <h2 className="h-display mt-2 text-4xl sm:text-5xl">{result.headline}</h2>

      <ol className="mt-8 space-y-5">
        {result.picks.map((pick, i) => (
          <PickRow key={pick.product.id} pick={pick} badge={BADGES[i] ?? BADGES[2]} />
        ))}
      </ol>

      <div className="mt-8 flex flex-wrap gap-3">
        <button className="btn-primary" onClick={onShuffle}>↻ Show me different ideas</button>
        <button className="btn-ghost" onClick={onEdit}>Change answers</button>
        <button className="btn-ghost" onClick={onRestart}>Start over</button>
      </div>

      {result.more.length > 0 && (
        <section className="mt-16">
          <h3 className="h-display text-2xl">More they might like</h3>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
            {result.more.map((m) => <ProductCard key={m.product.id} product={m.product} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function PickRow({ pick, badge }: { pick: GiftPick; badge: string }) {
  const p = pick.product;
  const price = formatPrice(p);
  return (
    <li className="grid overflow-hidden rounded-card border border-line bg-white shadow-soft sm:grid-cols-[220px_1fr]">
      <div className="relative aspect-[4/3] bg-cream sm:aspect-auto">
        {p.image_url && <Image src={p.image_url} alt={p.title} fill sizes="(min-width: 640px) 220px, 100vw" className="object-cover" />}
      </div>
      <div className="flex flex-col p-5 sm:p-6">
        <span className="text-sm font-semibold text-brand">{badge}</span>
        <h3 className="font-display mt-1 text-2xl font-bold tracking-tight leading-snug">{p.title.trim()}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-ink/80">{pick.reason}</p>
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
          <a href={outboundUrl(p)} target="_blank" rel="sponsored noopener" className="btn-primary px-4 py-2.5 text-sm">
            View gift{price ? ` · ${price}` : ""} ↗
          </a>
          <Link href={`/gift/${p.slug}`} className="text-sm font-semibold text-muted hover:text-ink">Details</Link>
        </div>
      </div>
    </li>
  );
}
