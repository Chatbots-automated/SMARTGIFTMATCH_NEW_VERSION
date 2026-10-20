import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "List Your Products — Partner With SmartGiftMatch",
  description: "Put your products in front of shoppers who are actively looking for a gift. Partner plans from €1/month, matched to the right people by our gift finder.",
  alternates: { canonical: "/become-partner" },
};

const PLANS = [
  {
    name: "Starter",
    price: "€1",
    tagline: "Essential visibility",
    features: ["Showcase 3 products", "Eligible for AI gift-finder matches", "Direct link to your shop"],
  },
  {
    name: "Booster",
    price: "€3",
    tagline: "Enhanced visibility",
    popular: true,
    features: ["Showcase 3 products", "Featured as a Partner's Offer", "Higher rotation priority", "Eligible for AI gift-finder matches", "Direct link to your shop"],
  },
  {
    name: "Premium",
    price: "€5",
    tagline: "Maximum visibility",
    features: ["Showcase 3 products", "Considered for Editor's Choice", "Featured in gift guides & editorial", "Social media shout-outs", "Top priority across listings"],
  },
];

export default function BecomePartnerPage() {
  const apply = `mailto:${SITE.email}?subject=${encodeURIComponent("Partner application")}&body=${encodeURIComponent("Shop name:\nWebsite:\nPlan (Starter / Booster / Premium):\nProducts you'd like to list:\n")}`;
  return (
    <>
      <section className="border-b border-line bg-cream/50">
        <div className="container-page py-12 sm:py-16">
          <Breadcrumbs items={[{ name: "For brands", path: "/become-partner" }]} />
          <p className="eyebrow mt-8">For brands & makers</p>
          <h1 className="h-display mt-3 max-w-3xl text-4xl sm:text-6xl">Get your products into the right hands.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            Every visitor to SmartGiftMatch is looking for a gift right now. Our gift finder matches your products to the people they suit — by interest, occasion, age and budget — so you reach shoppers who are ready to buy.
          </p>
        </div>
      </section>

      <section className="container-page mt-14">
        <div className="grid gap-5 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div key={plan.name} className={`relative flex flex-col rounded-[1.75rem] border bg-white p-7 ${plan.popular ? "border-brand shadow-lift" : "border-line shadow-soft"}`}>
              {plan.popular && <span className="absolute -top-3 left-7 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">Most popular</span>}
              <h2 className="text-lg font-semibold">{plan.name}</h2>
              <p className="text-sm text-muted">{plan.tagline}</p>
              <p className="mt-5">
                <span className="font-display text-5xl font-extrabold tracking-tight">{plan.price}</span>
                <span className="text-muted"> / month</span>
              </p>
              <ul className="mt-6 flex-1 space-y-3 text-[15px]">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2.5"><span className="text-brand-ink" aria-hidden>✓</span>{f}</li>
                ))}
              </ul>
              <a href={apply} className={`${plan.popular ? "btn-primary" : "btn-dark"} mt-8`}>Apply for {plan.name}</a>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-muted">Every product is reviewed by our editors before going live. Cancel any time.</p>
      </section>

      <section className="container-page mt-20 grid gap-6 md:grid-cols-3">
        {[
          ["Shoppers with intent", "People land here because they need a gift — not to scroll. That means higher-quality clicks to your shop."],
          ["Matched, not dumped", "Your products are shown to the people they actually suit, with a personal reason why they fit."],
          ["Simple & cheap", "No setup fees, no commission on top of your existing affiliate programme, no long contracts."],
        ].map(([t, d]) => (
          <div key={t} className="rounded-card border border-line bg-white p-6">
            <h3 className="text-lg font-semibold">{t}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{d}</p>
          </div>
        ))}
      </section>
    </>
  );
}
