import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GiftBrowser } from "@/components/GiftBrowser";
import { FinderCta } from "@/components/FinderCta";

export const metadata: Metadata = {
  title: "All Gift Ideas — Browse Our Hand-Picked Gift Catalogue",
  description: "Every gift in the SmartGiftMatch catalogue in one place. Filter by category and budget, or search for exactly what you have in mind.",
  alternates: { canonical: "/all-gifts" },
};

export default async function AllGiftsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return (
    <>
      <div className="container-page py-10">
        <Breadcrumbs items={[{ name: "All gifts", path: "/all-gifts" }]} />
        <h1 className="h-display mt-6 text-4xl sm:text-5xl">All gift ideas</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted">Every gift here has been hand-checked by our editors. Filter away — or let the gift finder do it for you.</p>
        <GiftBrowser products={products} categories={categories} />
      </div>
      <FinderCta />
    </>
  );
}
