import Link from "next/link";
import { Logo } from "./Logo";
import { COLLECTIONS } from "@/lib/nav";

const COLUMNS = [
  { title: "Shop by person", links: COLLECTIONS.map((c) => ({ href: c.href, label: `Gifts ${c.label.toLowerCase()}`.replace("Gifts editor's choice", "Editor's choice") })) },
  {
    title: "Explore",
    links: [
      { href: "/gift-finder", label: "Gift finder" },
      { href: "/all-gifts", label: "All gifts" },
      { href: "/blogs", label: "Gift guides" },
      { href: "/articles", label: "Articles" },
    ],
  },
  {
    title: "SmartGiftMatch",
    links: [
      { href: "/become-partner", label: "List your products" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
      { href: "/affiliate-disclosure", label: "Affiliate disclosure" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Logo white />
          <p className="mt-4 text-[15px] leading-relaxed text-white/60">
            Thoughtful gift ideas, matched to the person — not the algorithm&apos;s best-seller list.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="text-sm font-bold text-white">{col.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[15px] text-white/60 hover:text-brand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-white/10">
        <p className="container-page py-6 text-[13px] text-white/45">
          As an affiliate, SmartGiftMatch may earn a small commission when you buy through our links — at no extra cost to you.
        </p>
      </div>
    </footer>
  );
}
