import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCategories, getProducts } from "@/lib/data";
import { slugify } from "@/lib/product";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductGrid } from "@/components/ProductCard";
import { FinderCta } from "@/components/FinderCta";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

async function load(slug: string) {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const category = categories.find((c) => c.slug === slug);
  if (!category) return null;
  return { category, products: products.filter((p) => p.category && slugify(p.category) === slug) };
}

export async function generateMetadata({ params }: PageProps<"/gifts/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const data = await load(slug);
  if (!data) return { title: "Category not found", robots: { index: false } };
  const name = data.category.name;
  return {
    title: `${name} Gift Ideas — ${data.products.length} Hand-Picked Picks`,
    description: `Browse our favourite ${name.toLowerCase()} gifts, each one hand-checked by the SmartGiftMatch editors. Find something they'll actually use.`,
    alternates: { canonical: `/gifts/${slug}` },
  };
}

export default function CategoryPage(props: PageProps<"/gifts/[slug]">) {
  return (
    <Suspense fallback={<div className="container-page h-[600px]" />}>
      <Category {...props} />
    </Suspense>
  );
}

async function Category({ params }: PageProps<"/gifts/[slug]">) {
  const { slug } = await params;
  const data = await load(slug);
  if (!data) notFound();
  return (
    <>
      <div className="container-page py-10">
        <Breadcrumbs items={[{ name: "All gifts", path: "/all-gifts" }, { name: data.category.name, path: `/gifts/${slug}` }]} />
        <h1 className="h-display mt-6 text-4xl sm:text-5xl">{data.category.name} gifts</h1>
        <p className="mt-3 text-lg text-muted">{data.products.length} hand-picked ideas</p>
        <div className="mt-10">
          <ProductGrid products={data.products} priorityCount={3} />
        </div>
      </div>
      <FinderCta />
    </>
  );
}
