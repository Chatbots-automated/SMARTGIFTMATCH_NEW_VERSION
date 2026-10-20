import Link from "next/link";
import { Logo } from "./Logo";
import { COLLECTIONS, MAIN_NAV } from "@/lib/nav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          <div className="group relative">
            <Link href="/all-gifts" className="rounded-full px-3 py-2 text-[15px] font-medium text-ink/75 hover:text-brand-ink">
              Shop by person
            </Link>
            <div className="invisible absolute left-0 top-full w-56 translate-y-1 rounded-2xl border border-line bg-white p-2 opacity-0 shadow-lift transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              {COLLECTIONS.map((c) => (
                <Link key={c.href} href={c.href} className="flex items-center gap-3 rounded-xl px-3 py-2 text-[15px] hover:bg-cream">
                  <span aria-hidden>{c.emoji}</span> {c.label}
                </Link>
              ))}
            </div>
          </div>
          {MAIN_NAV.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full px-3 py-2 text-[15px] font-medium text-ink/75 hover:text-brand-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/gift-finder" className="btn-primary hidden px-4 py-2.5 text-sm sm:inline-flex">
            Find a gift
          </Link>
          <details className="relative md:hidden">
            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-line bg-white [&::-webkit-details-marker]:hidden" aria-label="Open menu">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            </summary>
            <div className="absolute right-0 top-12 w-64 rounded-2xl border border-line bg-white p-2 shadow-lift">
              <Link href="/gift-finder" className="btn-primary mb-2 w-full">Find a gift</Link>
              {[...COLLECTIONS, ...MAIN_NAV].map((item) => (
                <Link key={item.href} href={item.href} className="block rounded-xl px-3 py-2.5 text-[15px] hover:bg-cream">
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
