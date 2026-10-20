import type { Metadata } from "next";
import { Suspense } from "react";
import { GiftFinder } from "@/components/finder/GiftFinder";

export const metadata: Metadata = {
  title: "Gift Finder — Get 3 Perfect Gift Ideas in 60 Seconds",
  description:
    "Our free AI gift finder asks five quick questions about the person and suggests three thoughtful gifts that fit their interests, the occasion and your budget.",
  alternates: { canonical: "/gift-finder" },
};

export default function GiftFinderPage() {
  return (
    <div className="container-page py-8 sm:py-12">
      <h1 className="sr-only">SmartGiftMatch gift finder</h1>
      <Suspense fallback={<div className="h-[520px] animate-pulse rounded-[2rem] bg-cream" />}>
        <GiftFinder />
      </Suspense>
    </div>
  );
}
