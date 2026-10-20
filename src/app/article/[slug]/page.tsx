import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getArticle, getArticles } from "@/lib/data";
import { renderRichText, readingTime } from "@/lib/format";
import { plainExcerpt } from "@/lib/product";
import { SITE, absoluteUrl } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { FinderCta } from "@/components/FinderCta";

export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/article/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) return { title: "Article not found", robots: { index: false } };
  const description = plainExcerpt(a.excerpt || a.content);
  return {
    title: a.title,
    description,
    alternates: { canonical: `/article/${a.slug}` },
    openGraph: { type: "article", title: a.title, description, url: `/article/${a.slug}`, publishedTime: a.created_at, modifiedTime: a.updated_at, images: a.featured_image_url ? [a.featured_image_url] : undefined },
  };
}

export default function ArticlePage(props: PageProps<"/article/[slug]">) {
  return (
    <Suspense fallback={<div className="container-page h-[600px]" />}>
      <ArticleBody {...props} />
    </Suspense>
  );
}

async function ArticleBody({ params }: PageProps<"/article/[slug]">) {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) notFound();
  return (
    <>
      <article className="container-page max-w-3xl py-10">
        <Breadcrumbs items={[{ name: "Articles", path: "/articles" }, { name: a.title, path: `/article/${a.slug}` }]} />
        <header className="mt-8">
          <h1 className="h-display text-4xl leading-tight sm:text-5xl">{a.title}</h1>
          {a.excerpt && <p className="mt-5 text-xl leading-relaxed text-muted">{a.excerpt}</p>}
          <p className="mt-5 text-sm text-muted">
            {a.author && <>{a.author} · </>}
            <time dateTime={a.created_at}>{new Date(a.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time> · {readingTime(a.content ?? "")} min read
          </p>
        </header>
        {a.featured_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={a.featured_image_url} alt="" className="mt-8 w-full rounded-[2rem] border border-line" />
        )}
        <div className="prose-gift mt-8" dangerouslySetInnerHTML={{ __html: renderRichText(a.content ?? "") }} />
      </article>
      <FinderCta />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: plainExcerpt(a.excerpt || a.content),
          image: a.featured_image_url || undefined,
          datePublished: a.created_at,
          dateModified: a.updated_at,
          author: a.author ? { "@type": "Person", name: a.author } : { "@type": "Organization", name: SITE.name },
          publisher: { "@type": "Organization", name: SITE.name, logo: { "@type": "ImageObject", url: absoluteUrl("/favicon_smartgiftmatch.png") } },
          mainEntityOfPage: absoluteUrl(`/article/${a.slug}`),
        }}
      />
    </>
  );
}
