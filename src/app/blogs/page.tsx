import type { Metadata } from "next";
import { getBlogs } from "@/lib/data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StoryCard } from "@/components/BlogCard";

export const metadata: Metadata = {
  title: "Gift Guides — Ideas for Every Person & Occasion",
  description: "Seasonal gift guides from the SmartGiftMatch editors: Christmas, Valentine's Day, birthdays and more, with hand-picked gifts in every guide.",
  alternates: { canonical: "/blogs" },
};

export default async function BlogsPage() {
  const blogs = await getBlogs();
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: "Gift guides", path: "/blogs" }]} />
      <h1 className="h-display mt-6 text-4xl sm:text-5xl">Gift guides</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">Seasonal round-ups and ideas from our editors.</p>
      <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((b) => (
          <StoryCard key={b.id} href={`/blog/${b.slug}`} title={b.title} excerpt={b.content.excerpt} image={b.content.hero_image} date={b.created_at} />
        ))}
      </div>
    </div>
  );
}
