import type { Metadata } from "next";
import { getArticles } from "@/lib/data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StoryCard } from "@/components/BlogCard";

export const metadata: Metadata = {
  title: "Articles — The Art of Thoughtful Gift Giving",
  description: "Long reads on choosing better gifts: what makes a present meaningful, practical ideas for life's big moments and how to shop for the hard-to-buy-for.",
  alternates: { canonical: "/articles" },
};

export default async function ArticlesPage() {
  const articles = await getArticles();
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: "Articles", path: "/articles" }]} />
      <h1 className="h-display mt-6 text-4xl sm:text-5xl">Articles</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">Thinking about gifts, a little more deeply.</p>
      <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <StoryCard key={a.id} href={`/article/${a.slug}`} title={a.title} excerpt={a.excerpt} image={a.featured_image_url} date={a.created_at} />
        ))}
      </div>
    </div>
  );
}
