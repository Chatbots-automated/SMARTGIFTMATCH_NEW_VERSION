import type { MetadataRoute } from "next";
import { getArticles, getBlogs, getCategories, getPillarPages, getProducts } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, pillars, categories, blogs, articles] = await Promise.all([
    getProducts(),
    getPillarPages(),
    getCategories(),
    getBlogs(),
    getArticles(),
  ]);

  const latest = products[0]?.updated_at;
  const staticPages = [
    { path: "/", priority: 1, changeFrequency: "daily" as const, lastModified: latest },
    { path: "/gift-finder", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/all-gifts", priority: 0.8, changeFrequency: "daily" as const, lastModified: latest },
    { path: "/blogs", priority: 0.7, changeFrequency: "weekly" as const, lastModified: blogs[0]?.updated_at },
    { path: "/articles", priority: 0.7, changeFrequency: "weekly" as const, lastModified: articles[0]?.updated_at },
    { path: "/become-partner", priority: 0.4, changeFrequency: "monthly" as const },
    { path: "/faq", priority: 0.4, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/affiliate-disclosure", priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/privacy", priority: 0.1, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.1, changeFrequency: "yearly" as const },
  ];

  return [
    ...staticPages.map(({ path, ...rest }) => ({ url: absoluteUrl(path), ...rest })),
    ...pillars.map((p) => ({ url: absoluteUrl(`/${p.slug}`), lastModified: p.updated_at, changeFrequency: "weekly" as const, priority: 0.9 })),
    ...categories.map((c) => ({ url: absoluteUrl(`/gifts/${c.slug}`), changeFrequency: "weekly" as const, priority: 0.6 })),
    ...products.map((p) => ({
      url: absoluteUrl(`/gift/${p.slug}`),
      lastModified: p.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      images: p.image_url ? [p.image_url] : undefined,
    })),
    ...blogs.map((b) => ({ url: absoluteUrl(`/blog/${b.slug}`), lastModified: b.updated_at, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...articles.map((a) => ({ url: absoluteUrl(`/article/${a.slug}`), lastModified: a.updated_at, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
