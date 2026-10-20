import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProductBySlug, getProducts } from "@/lib/data";
import { approval, formatPrice, isPetProduct, outboundUrl, plainExcerpt, slugify } from "@/lib/product";
import { absoluteUrl } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { PRODUCT_GRID, ProductCard } from "@/components/ProductCard";
import { FinderCta } from "@/components/FinderCta";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/gift/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Gift not found", robots: { index: false } };
  const price = formatPrice(p);
  const title = `${p.title.trim()}${price ? ` — ${price}` : ""}`;
  const description = plainExcerpt(p.description) || `A hand-picked gift idea from SmartGiftMatch.`;
  return {
    title,
    description,
    alternates: { canonical: `/gift/${p.slug}` },
    openGraph: { title, description, url: `/gift/${p.slug}`, images: p.image_url ? [{ url: p.image_url, alt: p.title }] : undefined },
  };
}

export default function GiftPage(props: PageProps<"/gift/[slug]">) {
  return (
    <Suspense fallback={<div className="container-page h-[600px] py-10" />}>
      <GiftDetail {...props} />
    </Suspense>
  );
}

async function GiftDetail({ params }: PageProps<"/gift/[slug]">) {
  const { slug } = await params;
  const [p, all] = await Promise.all([getProductBySlug(slug), getProducts()]);
  if (!p) notFound();

  const price = formatPrice(p);
  const ap = approval(p);
  const f = p.product_form ?? {};
  const pet = isPetProduct(p);
  const related = all
    .filter((o) => o.id !== p.id && isPetProduct(o) === pet)
    .map((o) => ({ o, s: (o.category === p.category ? 2 : 0) + (o.product_form?.occasions ?? []).filter((x) => f.occasions?.includes(x)).length / 10 }))
    .sort((a, b) => b.s - a.s)
    .slice(0, 3)
    .map((x) => x.o);

  const facts = [
    f.occasions?.length && { label: "Great for", value: f.occasions.filter((o) => o !== "Other").slice(0, 5).join(", ") },
    f.age_brackets?.length && { label: pet ? "Pet age" : "Age", value: f.age_brackets.join(", ") },
    f.shipping_regions?.length && { label: "Ships to", value: f.shipping_regions.filter((r) => r !== "Other").join(", ") },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      <div className="container-page pt-8">
        <Breadcrumbs
          items={[
            { name: "All gifts", path: "/all-gifts" },
            ...(p.category ? [{ name: p.category, path: `/gifts/${slugify(p.category)}` }] : []),
            { name: p.title.trim(), path: `/gift/${p.slug}` },
          ]}
        />
      </div>

      <article className="container-page mt-6 grid gap-10 md:grid-cols-2 md:gap-14">
        <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-line bg-cream">
          {p.image_url && <Image src={p.image_url} alt={p.title} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />}
        </div>
        <div className="md:py-4">
          {p.editors_choice && <p className="eyebrow">⭐ Editor&apos;s choice</p>}
          <h1 className="h-display mt-3 text-4xl leading-tight sm:text-5xl">{p.title.trim()}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {price && <span className="rounded-full bg-cream px-4 py-1.5 text-lg font-bold text-ink">{price}</span>}
            {ap != null && (p.reviews?.total ?? 0) >= 3 && (
              <span className="text-sm font-medium text-muted">👍 {Math.round(ap * 100)}% of {p.reviews?.total} gifters liked this</span>
            )}
          </div>
          {p.description && <p className="mt-6 text-[17px] leading-relaxed text-ink/85">{p.description}</p>}

          <a href={outboundUrl(p)} target="_blank" rel="sponsored noopener" className="btn-primary mt-8 w-full sm:w-auto">
            Check price & buy ↗
          </a>
          <p className="mt-3 text-[13px] text-muted">You&apos;ll go to the shop&apos;s site. We may earn a small commission at no cost to you.</p>

          {facts.length > 0 && (
            <dl className="mt-8 divide-y divide-line rounded-card border border-line bg-white">
              {facts.map((fact) => (
                <div key={fact.label} className="grid grid-cols-[110px_1fr] gap-4 px-5 py-4 text-[15px]">
                  <dt className="font-semibold">{fact.label}</dt>
                  <dd className="text-muted">{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="container-page mt-20">
          <h2 className="h-display text-3xl">You might also like</h2>
          <div className={`mt-6 ${PRODUCT_GRID}`}>
            {related.map((r) => <ProductCard key={r.id} product={r} />)}
          </div>
        </section>
      )}

      <FinderCta title="Not quite right?" />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.title.trim(),
          description: plainExcerpt(p.description, 500),
          image: p.image_url ?? undefined,
          category: p.category ?? undefined,
          url: absoluteUrl(`/gift/${p.slug}`),
          ...(p.price != null && {
            offers: {
              "@type": "Offer",
              price: Number(p.price).toFixed(2),
              priceCurrency: p.currency ?? "EUR",
              availability: "https://schema.org/InStock",
              url: absoluteUrl(`/gift/${p.slug}`),
            },
          }),
        }}
      />
    </>
  );
}
