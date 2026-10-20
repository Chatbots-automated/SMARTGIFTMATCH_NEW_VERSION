import Link from "next/link";
import { LogoMark } from "./Logo";
import { Accent } from "./three/Accents";

export function FinderCta({ title = "Still not sure?", text = "Tell us a little about them and we'll pick three gifts they'll actually love." }: { title?: string; text?: string }) {
  return (
    <section className="container-page mt-24">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-brand px-6 py-14 text-white sm:px-14">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_120%_at_100%_0%,#fb923c_0%,transparent_55%)]" />
        <LogoMark white className="pointer-events-none absolute -right-10 -bottom-14 h-72 w-72 rotate-[-12deg] opacity-15 sm:hidden" />
        <Accent
          kind="gift"
          className="absolute inset-y-5 right-5 hidden w-[42%] max-w-[420px] sm:block"
          fallback={<LogoMark white className="h-72 w-72 rotate-[-12deg] opacity-15" />}
        />
        <div className="relative max-w-xl sm:max-w-[55%]">
          <h2 className="h-display text-4xl sm:text-5xl">{title}</h2>
          <p className="mt-4 text-lg text-white/85">{text}</p>
          <Link href="/gift-finder" className="btn mt-8 bg-white text-ink shadow-lift hover:bg-ink hover:text-white">
            Start the gift finder →
          </Link>
        </div>
      </div>
    </section>
  );
}
