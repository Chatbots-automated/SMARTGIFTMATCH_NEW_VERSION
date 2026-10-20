import Image from "next/image";
import Link from "next/link";

export function LogoMark({ className = "h-9 w-9", white }: { className?: string; white?: boolean }) {
  return <Image src={white ? "/logo-white.png" : "/logo-orange.png"} alt="" width={72} height={72} className={className} priority />;
}

export function Logo({ white }: { white?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-1.5" aria-label="SmartGiftMatch home">
      {/* The bow sits on top of the mark, so the box itself is below centre — lift it to line up with the wordmark. */}
      <LogoMark white={white} className="h-10 w-10 -translate-y-1 transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:-rotate-6" />
      <span className={`font-display text-[22px] font-extrabold tracking-[-0.03em] ${white ? "text-white" : "text-ink"}`}>
        SmartGift<span className={white ? "text-brand" : "text-brand"}>Match</span>
      </span>
    </Link>
  );
}
