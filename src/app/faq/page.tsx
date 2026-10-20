import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { FULL_FAQ } from "@/lib/faq";

export const metadata: Metadata = {
  title: "FAQ — How the SmartGiftMatch Gift Finder Works",
  description: "Answers to common questions about SmartGiftMatch: how gift matching works, whether it's free, gifts for pets, shipping, privacy and listing your products.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <div className="container-page max-w-3xl py-10">
      <Breadcrumbs items={[{ name: "FAQ", path: "/faq" }]} />
      <h1 className="h-display mt-8 text-4xl sm:text-5xl">Frequently asked questions</h1>
      <div className="mt-8 divide-y divide-line border-y border-line">
        {FULL_FAQ.map((f) => (
          <section key={f.q} className="py-6">
            <h2 className="text-xl font-semibold">{f.q}</h2>
            <p className="mt-2 text-[16px] leading-relaxed text-muted">{f.a}</p>
          </section>
        ))}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FULL_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
    </div>
  );
}
