import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-6xl" aria-hidden>🎁</p>
      <h1 className="h-display mt-6 text-4xl sm:text-5xl">This page got unwrapped already.</h1>
      <p className="mt-4 max-w-md text-lg text-muted">We couldn&apos;t find what you were looking for — but we can definitely find a gift.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/gift-finder" className="btn-primary">Start the gift finder</Link>
        <Link href="/all-gifts" className="btn-ghost">Browse all gifts</Link>
      </div>
    </div>
  );
}
