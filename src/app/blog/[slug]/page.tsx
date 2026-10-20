import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getBlog, getBlogs } from "@/lib/data";
import { renderRichText, readingTime } from "@/lib/format";
import { plainExcerpt } from "@/lib/product";
import { SITE, absoluteUrl } from "@/lib/site";
import type { Blog, BlogSection } from "@/lib/types";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { FinderCta } from "@/components/FinderCta";

export async function generateStaticParams() {
  return (await getBlogs()).map((b) => ({ slug: b.slug }));
}

const textOf = (s: BlogSection) => (typeof s.content === "string" ? s.content : "text" in s.content ? s.content.text ?? "" : "");

function describe(b: Blog) {
  return b.content.meta_description || b.content.excerpt || plainExcerpt((b.content.sections ?? []).map(textOf).join(" "));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const b = await getBlog(slug);
  if (!b) return { title: "Guide not found", robots: { index: false } };
  const description = plainExcerpt(describe(b));
  return {
    title: b.title,
    description,
    alternates: { canonical: `/blog/${b.slug}` },
    openGraph: { type: "article", title: b.title, description, url: `/blog/${b.slug}`, publishedTime: b.created_at, modifiedTime: b.updated_at, images: b.content.hero_image ? [b.content.hero_image] : undefined },
  };
}

export default function BlogPage(props: PageProps<"/blog/[slug]">) {
  return (
    <Suspense fallback={<div className="container-page h-[600px]" />}>
      <BlogPost {...props} />
    </Suspense>
  );
}

async function BlogPost({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const b = await getBlog(slug);
  if (!b) notFound();
  const sections = b.content.sections ?? [];
  const minutes = readingTime(sections.map(textOf).join(" "));

  return (
    <>
      <article className="container-page max-w-3xl py-10">
        <Breadcrumbs items={[{ name: "Gift guides", path: "/blogs" }, { name: b.title, path: `/blog/${b.slug}` }]} />
        <header className="mt-8">
          <h1 className="h-display text-4xl leading-tight sm:text-5xl">{b.title}</h1>
          {b.content.excerpt && <p className="mt-5 text-xl leading-relaxed text-muted">{b.content.excerpt}</p>}
          <p className="mt-5 text-sm text-muted">
            <time dateTime={b.created_at}>{new Date(b.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time> · {minutes} min read
          </p>
        </header>
        {b.content.hero_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={b.content.hero_image} alt="" className="mt-8 w-full rounded-[2rem] border border-line" />
        )}
        <div className="prose-gift mt-8">
          {sections.map((s, i) => <Section key={i} section={s} />)}
        </div>
      </article>
      <FinderCta />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: b.title,
          description: plainExcerpt(describe(b)),
          image: b.content.hero_image || undefined,
          datePublished: b.created_at,
          dateModified: b.updated_at,
          author: { "@type": "Organization", name: SITE.name, url: SITE.url },
          publisher: { "@type": "Organization", name: SITE.name, logo: { "@type": "ImageObject", url: absoluteUrl("/favicon_smartgiftmatch.png") } },
          mainEntityOfPage: absoluteUrl(`/blog/${b.slug}`),
        }}
      />
    </>
  );
}

function Section({ section }: { section: BlogSection }) {
  switch (section.type) {
    case "text": {
      const text = textOf(section);
      if (!text) return null;
      return (
        <>
          {section.heading && <h2>{section.heading}</h2>}
          <div dangerouslySetInnerHTML={{ __html: renderRichText(text) }} />
        </>
      );
    }
    case "image":
      if (!section.content.url) return null;
      return (
        <figure className="my-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={section.content.url} alt={section.content.caption ?? ""} loading="lazy" className="w-full rounded-card border border-line" />
          {section.content.caption && <figcaption className="mt-3 text-center text-sm text-muted">{section.content.caption}</figcaption>}
        </figure>
      );
    case "quote": {
      const text = textOf(section);
      if (!text) return null;
      const author = typeof section.content === "string" ? undefined : section.content.author;
      return (
        <blockquote className="font-display my-10 border-l-4 border-brand pl-6 text-2xl font-semibold leading-snug text-ink">
          “{text}”
          {author && <footer className="mt-3 font-sans text-base text-muted">— {author}</footer>}
        </blockquote>
      );
    }
    case "gift_cards": {
      const cards = (section.content.cards ?? []).filter((c) => c.title && c.image_url && c.affiliate_url);
      if (!cards.length) return null;
      return (
        <div className="not-prose my-10">
          {section.heading && <h2>{section.heading}</h2>}
          <div className="grid gap-4 sm:grid-cols-2">
            {cards.map((c) => (
              <a key={c.affiliate_url} href={c.affiliate_url} target="_blank" rel="sponsored noopener" className="group flex gap-4 rounded-card border border-line bg-white p-3 no-underline shadow-soft transition hover:shadow-lift">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image_url} alt="" loading="lazy" className="h-24 w-24 shrink-0 rounded-xl object-cover" />
                <span className="flex flex-col">
                  <span className="font-semibold text-ink group-hover:text-brand">{c.title}</span>
                  {c.price && <span className="text-sm font-semibold text-brand-ink">{c.price}</span>}
                  {c.description && <span className="mt-1 line-clamp-2 text-sm text-muted">{c.description}</span>}
                </span>
              </a>
            ))}
          </div>
        </div>
      );
    }
    default:
      return null;
  }
}
