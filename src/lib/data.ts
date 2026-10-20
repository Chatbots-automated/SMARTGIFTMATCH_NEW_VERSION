import { cacheLife, cacheTag } from "next/cache";
import { supabase } from "./supabase";
import type { Article, Blog, PillarPage, Product, Testimonial } from "./types";
import { isPetProduct, slugify } from "./product";

const PRODUCT_COLUMNS =
  "id,title,slug,description,image_url,affiliate_url,category,price,currency,editors_choice,partners_offer,product_form,reviews,created_at,updated_at";

export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getProducts", error.message);
    return [];
  }
  return (data as Product[]).map((p) => ({ ...p, slug: p.slug || slugify(p.title) }));
}

export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getCategories() {
  const products = await getProducts();
  const counts = new Map<string, number>();
  for (const p of products) {
    if (!p.category) continue;
    counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, slug: slugify(name), count }))
    .sort((a, b) => b.count - a.count);
}

export async function getPillarPages(): Promise<PillarPage[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("pillar_pages");
  const { data, error } = await supabase
    .from("pillar_pages")
    .select("id,title,slug,description,meta_title,meta_description,hero_image_url,sort_order,updated_at")
    .eq("status", "published")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("getPillarPages", error.message);
    return [];
  }
  // Internal test pages should never reach Google.
  return (data as PillarPage[]).filter((p) => !/test/i.test(p.slug));
}

/** Rules used when a collection has no hand-picked products assigned. */
const PILLAR_RULES: Record<string, (p: Product) => boolean> = {
  "gifts-for-him": (p) => !isPetProduct(p) && hasAny(p.product_form?.gender_targeting, ["Male"]),
  "gifts-for-her": (p) => !isPetProduct(p) && hasAny(p.product_form?.gender_targeting, ["Female"]),
  "gifts-for-kids": (p) => !isPetProduct(p) && hasAny(p.product_form?.age_brackets, ["Infant", "Child"]),
  "gifts-for-teenagers": (p) => !isPetProduct(p) && hasAny(p.product_form?.age_brackets, ["Teen"]),
  "gifts-for-pets": (p) => isPetProduct(p),
  "editors-choice": (p) => !!p.editors_choice,
};

function hasAny(list: string[] | undefined, values: string[]) {
  return !!list?.some((v) => values.includes(v));
}

async function getPillarProductIds(pillarId: string): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("pillar_pages");
  const { data, error } = await supabase
    .from("pillar_page_products")
    .select("product_id,sort_order")
    .eq("pillar_page_id", pillarId)
    .order("sort_order", { ascending: true });
  if (error) return [];
  return data.map((r) => r.product_id as string);
}

export async function getPillarPage(slug: string) {
  const pages = await getPillarPages();
  const page = pages.find((p) => p.slug === slug);
  if (!page) return null;

  const [products, ids] = await Promise.all([getProducts(), getPillarProductIds(page.id)]);
  let list: Product[];
  if (ids.length) {
    const byId = new Map(products.map((p) => [p.id, p]));
    list = ids.map((id) => byId.get(id)).filter((p): p is Product => !!p);
  } else {
    const rule = PILLAR_RULES[slug];
    list = rule ? products.filter(rule) : [];
  }
  return { page, products: list };
}

export async function getBlogs(): Promise<Blog[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("blogs");
  const { data, error } = await supabase
    .from("blogs")
    .select("id,slug,title,created_at,updated_at,featured,content")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getBlogs", error.message);
    return [];
  }
  return data as Blog[];
}

export async function getBlog(slug: string) {
  const blogs = await getBlogs();
  return blogs.find((b) => b.slug === slug) ?? null;
}

export async function getArticles(): Promise<Article[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("articles");
  const { data, error } = await supabase
    .from("articles")
    .select("id,title,slug,excerpt,content,featured_image_url,author,featured,tags,created_at,updated_at")
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getArticles", error.message);
    return [];
  }
  return data as Article[];
}

export async function getArticle(slug: string) {
  const articles = await getArticles();
  return articles.find((a) => a.slug === slug) ?? null;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("testimonials");
  const { data, error } = await supabase
    .from("testimonials")
    .select("id,author_name,title,body,rating,location")
    .eq("status", "approved")
    .order("featured", { ascending: false })
    .limit(6);
  if (error) return [];
  return data as Testimonial[];
}
