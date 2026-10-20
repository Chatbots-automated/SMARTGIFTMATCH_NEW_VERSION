/** Flat stand-in for the 3D gift: shown before the scene loads, and to reduced-motion / no-WebGL visitors. */
export function GiftFallback({ className = "h-[58%] w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 190" aria-hidden className={`${className} drop-shadow-[0_18px_24px_rgb(124_45_18/0.35)]`}>
      <path d="M100 52c-14-26-46-30-48-12-2 16 30 16 48 12Zm0 0c14-26 46-30 48-12 2 16-30 16-48 12Z" fill="#b4360a" />
      <rect x="22" y="56" width="156" height="34" rx="6" fill="#fffaf5" />
      <rect x="32" y="90" width="136" height="96" rx="6" fill="#f5ede6" />
      <rect x="86" y="56" width="28" height="130" fill="#b4360a" />
    </svg>
  );
}
