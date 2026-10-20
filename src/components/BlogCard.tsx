import Link from "next/link";
import { Tilt } from "./Tilt";

export function StoryCard({ href, title, excerpt, image, date }: { href: string; title: string; excerpt?: string | null; image?: string | null; date: string }) {
  return (
    <Link href={href} className="group block rounded-[1.6rem] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
      <article>
        <Tilt className="aspect-[16/10] rounded-[1.6rem] bg-cream shadow-soft group-hover:shadow-lift" max={9}>
          <div className="absolute inset-0 overflow-hidden rounded-[1.6rem]">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element -- editorial images can live on any host
              <img src={image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]" />
            ) : (
              <div className="flex h-full items-center justify-center text-5xl" aria-hidden>🎁</div>
            )}
          </div>
          <time dateTime={date} className="tilt-layer absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-ink shadow-soft backdrop-blur [--z:36px]">
            {new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </time>
          <span aria-hidden className="tilt-layer absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm text-white opacity-0 shadow-brand transition-opacity group-hover:opacity-100 [--z:44px]">
            ↗
          </span>
        </Tilt>
        <h3 className="mt-3 font-display text-lg leading-snug font-bold tracking-tight text-balance transition-colors group-hover:text-brand-ink">{title}</h3>
        {excerpt && <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">{excerpt}</p>}
      </article>
    </Link>
  );
}
