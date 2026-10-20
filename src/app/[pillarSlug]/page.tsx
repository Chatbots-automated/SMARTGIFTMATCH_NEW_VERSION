import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getPillarPage, getPillarPages } from "@/lib/data";
import { plainExcerpt } from "@/lib/product";
import { absoluteUrl } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ProductGrid } from "@/components/ProductCard";
import { FinderCta } from "@/components/FinderCta";
import { COLLECTIONS } from "@/lib/nav";
import Link from "next/link";

export async function generateStaticParams() {
  const pages = await getPillarPages();
  return pages.map((p) => ({ pillarSlug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[pillarSlug]">): Promise<Metadata> {
  const { pillarSlug } = await params;
  const data = await getPillarPage(pillarSlug);
  if (!data) return { title: "Page not found", robots: { index: false } };
  const { page, products } = data;
  const title = page.meta_title?.replace(/\s*\|\s*SmartGiftMatch\s*$/i, "") || `${page.title} — ${products.length} Thoughtful Gift Ideas`;
  const description = page.meta_description || plainExcerpt(page.description) || `Hand-picked ${page.title.toLowerCase()} ideas from SmartGiftMatch.`;
  return {
    title,
    description,
    alternates: { canonical: `/${page.slug}` },
    openGraph: { title, description, url: `/${page.slug}`, images: page.hero_image_url ? [page.hero_image_url] : undefined },
  };
}

export default function PillarPage(props: PageProps<"/[pillarSlug]">) {
  return (
    <Suspense fallback={<div className="container-page h-[600px]" />}>
      <Pillar {...props} />
    </Suspense>
  );
}

async function Pillar({ params }: PageProps<"/[pillarSlug]">) {
  const { pillarSlug } = await params;
  const data = await getPillarPage(pillarSlug);
  if (!data) notFound();
  const { page, products } = data;

  return (
    <>
      <section className="border-b border-line bg-cream/50">
        <div className="container-page py-10 sm:py-14">
          <Breadcrumbs items={[{ name: page.title, path: `/${page.slug}` }]} />
          <h1 className="h-display mt-6 text-4xl sm:text-6xl">{page.title}</h1>
          {page.description && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{page.description}</p>}
          <nav aria-label="Other collections" className="mt-8 flex flex-wrap gap-2">
            {COLLECTIONS.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                aria-current={c.href === `/${page.slug}` ? "page" : undefined}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium hover:border-ink aria-[current=page]:border-ink aria-[current=page]:bg-ink aria-[current=page]:text-paper"
              >
                <span aria-hidden>{c.emoji}</span> {c.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="container-page mt-10">
        <p className="mb-6 text-sm text-muted">{products.length} gift ideas</p>
        {products.length ? <ProductGrid products={products} priorityCount={3} /> : <p className="text-muted">New gifts are on their way — check back soon.</p>}
      </section>

      <FinderCta />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: page.title,
          description: page.meta_description ?? page.description ?? undefined,
          url: absoluteUrl(`/${page.slug}`),
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: products.length,
            itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(`/gift/${p.slug}`), name: p.title.trim() })),
          },
        }}
      />
    </>
  );
}
