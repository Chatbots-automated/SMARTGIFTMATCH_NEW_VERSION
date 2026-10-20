import { Breadcrumbs } from "./Breadcrumbs";

export function LegalPage({ title, path, updated, intro, children }: { title: string; path: string; updated?: string; intro?: string; children: React.ReactNode }) {
  return (
    <article className="container-page max-w-3xl py-10">
      <Breadcrumbs items={[{ name: title, path }]} />
      <h1 className="h-display mt-8 text-4xl sm:text-5xl">{title}</h1>
      {intro && <p className="mt-4 text-lg leading-relaxed text-muted">{intro}</p>}
      {updated && <p className="mt-4 text-sm text-muted">Last updated: {updated}</p>}
      <div className="prose-gift mt-8">{children}</div>
    </article>
  );
}
