import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getBlogs, getPillarPages, getProducts, getTestimonials } from "@/lib/data";
import { formatPrice } from "@/lib/product";
import { LogoMark } from "@/components/Logo";
import { PRODUCT_GRID, ProductCard } from "@/components/ProductCard";
import { Tilt } from "@/components/Tilt";
import { StoryCard } from "@/components/BlogCard";
import { FinderCta } from "@/components/FinderCta";
import { HeroStage } from "@/components/home/HeroStage";
import { Accent } from "@/components/three/Accents";
import type { AccentKind } from "@/components/three/accent-views";
import { JsonLd } from "@/components/JsonLd";
import { COLLECTIONS } from "@/lib/nav";
import { HOME_FAQ } from "@/lib/faq";

export const metadata: Metadata = {
  title: { absolute: "SmartGiftMatch — Find the Perfect Gift in Under a Minute" },
  description:
    "Not sure what to buy? Answer 5 quick questions and get three hand-picked gift ideas for partners, parents, friends, kids and pets. Free, no sign-up.",
  alternates: { canonical: "/" },
};

const QUICK_STARTS = [
  { label: "My partner", q: "relation=Partner" },
  { label: "Mum or Dad", q: "relation=Parent" },
  { label: "A friend", q: "relation=Friend" },
  { label: "A colleague", q: "relation=Colleague" },
  { label: "A kid", q: "relation=Child" },
  { label: "My pet 🐾", q: "for=pet" },
];

export default async function HomePage() {
  const [products, blogs, testimonials, pillars] = await Promise.all([getProducts(), getBlogs(), getTestimonials(), getPillarPages()]);
  const pillarImage = new Map(
    pillars.filter((p) => p.hero_image_url && /\.(jpe?g|png|webp|avif)(\?|$)|\/storage\/v1\/object\//i.test(p.hero_image_url)).map((p) => [`/${p.slug}`, p.hero_image_url]),
  );
  const picks = [...products].sort((a, b) => Number(!!b.editors_choice) - Number(!!a.editors_choice) || (b.reviews?.good ?? 0) - (a.reviews?.good ?? 0));
  const heroImages = picks.filter((p) => p.image_url && (p.price ?? 0) < 100).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(55%_65%_at_10%_0%,rgb(249_115_22/0.16)_0%,transparent_70%),radial-gradient(45%_55%_at_95%_15%,rgb(249_115_22/0.10)_0%,transparent_70%)]" />
        <div className="container-page relative grid items-center gap-14 pt-12 pb-20 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-white px-3.5 py-1.5 text-[13px] font-semibold text-brand-ink shadow-soft">
              <span className="h-2 w-2 rounded-full bg-brand" aria-hidden /> Free AI gift finder · no sign-up
            </span>
            <h1 className="h-display mt-6 text-[2.9rem] leading-[1] sm:text-7xl">
              Find a gift they&apos;ll{" "}
              <span className="relative whitespace-nowrap text-brand">
                actually love
                <svg aria-hidden viewBox="0 0 300 16" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full text-brand/35"><path d="M2 12C70 3 230 3 298 10" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" /></svg>
              </span>
              .
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-muted">
              Answer five quick questions and get three hand-picked gift ideas — each with a reason it fits. For partners, parents, friends, kids and pets.
            </p>
            <div className="mt-9">
              <p className="text-sm font-bold">Who are you shopping for?</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {QUICK_STARTS.map((s) => (
                  <Link key={s.label} href={`/gift-finder?${s.q}`} className="rounded-full border border-line bg-white px-4 py-2 text-[15px] font-semibold shadow-soft transition hover:-translate-y-0.5 hover:border-brand hover:text-brand-ink">
                    {s.label}
                  </Link>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link href="/gift-finder" className="btn-primary px-7 py-4 text-base">Start the gift finder →</Link>
                <p className="text-sm text-muted"><span className="font-bold text-ink">{products.length}+</span> hand-checked gifts · takes 60 seconds</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto mt-10 w-full min-w-0 max-w-[520px] lg:mt-0" aria-hidden>
            <div className="absolute inset-0 overflow-hidden rounded-[2.75rem] bg-brand shadow-brand">
              <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_18%,#fdba74_0%,#fb923c_35%,transparent_70%)]" />
              <LogoMark white className="absolute -right-16 bottom-24 h-72 w-72 rotate-12 opacity-[0.1]" />
              <LogoMark white className="absolute -bottom-20 -left-16 h-72 w-72 -rotate-12 opacity-[0.08]" />
            </div>
            <HeroStage className="absolute inset-x-0 -top-16 h-[390px] sm:-top-20 sm:h-[460px]" />
            <div className="relative px-5 pt-[300px] pb-9 sm:px-8 sm:pt-[360px] sm:pb-10">
              <div className="mx-auto max-w-[400px] rotate-[-1deg] rounded-[1.4rem] bg-white/95 p-2 shadow-lift backdrop-blur">
                <div className="flex items-center justify-between gap-3 px-2.5 pt-1.5 pb-2">
                  <p className="whitespace-nowrap text-[13px] font-bold">Your top 3 matches 🎁</p>
                  <p className="whitespace-nowrap rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-semibold text-brand-ink">Birthday · under €100</p>
                </div>
                <div className="space-y-1">
                  {heroImages.map((p, i) => (
                    <div key={p.id} className={`flex items-center gap-3 rounded-2xl p-1.5 pr-3 ${i === 0 ? "bg-brand-soft" : ""}`}>
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-cream">
                        <Image src={p.image_url!} alt="" fill sizes="44px" priority className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold leading-tight text-brand-ink">{["Best match", "Great alternative", "Wildcard"][i]}</p>
                        <p className="truncate font-display text-sm font-bold tracking-tight">{p.title.trim()}</p>
                      </div>
                      <div className="shrink-0 text-right leading-tight">
                        <p className="text-xs font-bold">{[97, 93, 88][i]}%</p>
                        <p className="text-[11px] text-muted">{formatPrice(p)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-3 rotate-[-3deg] rounded-2xl bg-ink px-4 py-3 text-white shadow-lift sm:-left-8">
              <p className="text-sm font-bold">✨ Picked in 4 seconds</p>
              <p className="text-xs text-white/60">“They&apos;ll love the first one.”</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-line bg-cream/60" aria-labelledby="how">
        <div className="container-page py-16">
          <SectionHead id="how" eyebrow="How it works" title="Three steps. Zero stress." />
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {([
              ["Tell us who", "Relationship, age and a few things they love. Thirty seconds, tops.", "heart", "💝"],
              ["We do the thinking", "Our matcher weighs every gift against their interests, the occasion and your budget.", "spark", "✨"],
              ["Pick your favourite", "Three gifts, each with a reason it fits. Not feeling it? Shuffle for more.", "present", "🎁"],
            ] as const).map(([title, text, accent, emoji], i) => (
              <li key={title} className="relative">
                <div className="relative h-16 w-16 rounded-[1.4rem] bg-brand shadow-brand">
                  <Accent kind={accent} className="absolute -inset-3" fallback={<span className="text-3xl">{emoji}</span>} />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink font-display text-xs font-extrabold text-white ring-2 ring-paper">{i + 1}</span>
                </div>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Collections */}
      <section className="container-page mt-24" aria-labelledby="collections">
        <SectionHead id="collections" eyebrow="Browse" title="Shop by person" accent="gifts" />
        <div className="mt-8 grid grid-cols-3 gap-2.5 sm:gap-4 lg:grid-cols-6">
          {COLLECTIONS.map((c, i) => {
            const img = pillarImage.get(c.href);
            return (
              <Link key={c.href} href={c.href} className="group block rounded-[1.5rem] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
                <Tilt className={`aspect-[3/4] rounded-[1.25rem] sm:aspect-[4/5] sm:rounded-[1.5rem] shadow-soft group-hover:shadow-lift ${img ? "bg-cream" : i % 2 ? "bg-ink" : "bg-brand"}`}>
                  <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
                    {img && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                    )}
                    <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                  </div>
                  {!img && (
                    <span aria-hidden className="tilt-layer absolute inset-x-0 top-[16%] text-center text-4xl drop-shadow-[0_10px_14px_rgb(0_0_0/0.3)] [--z:56px] sm:text-6xl">{c.emoji}</span>
                  )}
                  <span className="tilt-layer absolute inset-x-2.5 bottom-2.5 flex items-end justify-between gap-2 [--z:36px] sm:inset-x-3 sm:bottom-3">
                    <span className="font-display text-[15px] leading-[1.05] font-bold tracking-tight text-white sm:text-lg">
                      {c.href === "/editors-choice" ? <>Editor&apos;s<br />choice</> : <>Gifts<br />{c.label.toLowerCase()}</>}
                    </span>
                    <span aria-hidden className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white sm:flex text-sm text-ink transition group-hover:bg-brand group-hover:text-white">→</span>
                  </span>
                </Tilt>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Editor's picks */}
      <section className="container-page mt-24" aria-labelledby="picks">
        <SectionHead id="picks" eyebrow="Hand-picked" title="Gifts our editors keep recommending" accent="star" link={{ href: "/all-gifts", label: "See all gifts →" }} />
        {/* the picks stand on a little lit stage with a perspective grid floor */}
        <div className="relative mt-8 overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-brand-soft via-brand-soft/60 to-cream/50 px-3 pt-5 pb-12 sm:px-6 sm:pt-7 sm:pb-16">
          <div aria-hidden className="stage-floor pointer-events-none absolute inset-x-[-10%] bottom-0 h-56 opacity-50" />
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-40 w-2/3 -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(255_255_255/0.9),transparent)]" />
          <div className={`relative ${PRODUCT_GRID}`}>
            {picks.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Guides */}
      {blogs.length > 0 && (
        <section className="container-page mt-24" aria-labelledby="guides">
          <SectionHead id="guides" eyebrow="Gift guides" title="Ideas for every occasion" accent="balloons" link={{ href: "/blogs", label: "All guides →" }} />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.slice(0, 3).map((b) => (
              <StoryCard key={b.id} href={`/blog/${b.slug}`} title={b.title} excerpt={b.content.excerpt} image={b.content.hero_image} date={b.created_at} />
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="container-page mt-24" aria-labelledby="love">
          <SectionHead id="love" title="Happy gifters" accent="hearts" />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t, i) => (
              <Tilt key={t.id} max={8} className={`rounded-[1.6rem] bg-white shadow-soft ring-1 ring-line ${["md:-rotate-1", "md:rotate-1 md:translate-y-3", "md:-rotate-[0.5deg]"][i % 3]}`}>
                <figure className="relative p-5 [transform-style:preserve-3d] sm:p-6">
                  <span aria-hidden className="tilt-layer absolute -top-4 right-5 font-display text-7xl leading-none text-brand [--z:50px]">“</span>
                  <div className="tilt-layer text-sm text-brand [--z:20px]" aria-label={`${t.rating ?? 5} out of 5`}>{"★".repeat(t.rating ?? 5)}</div>
                  <blockquote className="tilt-layer mt-2 text-base leading-snug font-semibold [--z:28px]">{t.body}</blockquote>
                  <figcaption className="tilt-layer mt-4 flex items-center gap-2 text-sm text-muted [--z:16px]">
                    <span aria-hidden className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-soft font-display text-xs font-bold text-brand-ink">{t.author_name.trim().charAt(0)}</span>
                    {t.author_name}{t.location ? ` · ${t.location}` : ""}
                  </figcaption>
                </figure>
              </Tilt>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="container-page mt-24 max-w-3xl" aria-labelledby="faq">
        <SectionHead id="faq" title="Questions, answered" accent="bauble" />
        <div className="mt-6 divide-y divide-line border-y border-line">
          {HOME_FAQ.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream text-xl text-ink transition group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <p className="mt-3 text-[16px] leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: HOME_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }}
        />
      </section>

      <FinderCta title="Ready when you are." />
    </>
  );
}

function SectionHead({ id, eyebrow, title, accent, link }: { id: string; eyebrow?: string; title: string; accent?: AccentKind; link?: { href: string; label: string } }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="flex items-end gap-1 sm:gap-2">
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 id={id} className={`h-display text-3xl sm:text-4xl ${eyebrow ? "mt-2" : ""}`}>{title}</h2>
        </div>
        {accent && <Accent kind={accent} className="relative -mb-2 h-16 w-20 shrink-0 sm:h-20 sm:w-24" />}
      </div>
      {link && <Link href={link.href} className="hidden shrink-0 font-bold text-brand-ink hover:underline sm:block">{link.label}</Link>}
    </div>
  );
}
