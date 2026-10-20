import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { approval, formatPrice } from "@/lib/product";
import { Tilt } from "./Tilt";

/** Compact product grid: two up on phones, four on desktop. */
export const PRODUCT_GRID = "grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4";

export function ProductCard({ product, reason, badge, priority }: { product: Product; reason?: string; badge?: string; priority?: boolean }) {
  const price = formatPrice(product);
  const ap = approval(product);
  const liked = ap != null && (product.reviews?.total ?? 0) >= 3 ? Math.round(ap * 100) : null;
  return (
    <Link href={`/gift/${product.slug}`} className="group block rounded-[1.6rem] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
      <Tilt className="h-full rounded-[1.6rem] bg-white p-1.5 shadow-soft ring-1 ring-line group-hover:shadow-lift sm:p-2">
        <article className="flex h-full flex-col [transform-style:preserve-3d]">
          <div className="tilt-layer relative aspect-square rounded-[1.2rem] bg-cream [--z:26px] [transform-style:preserve-3d]">
            <div className="absolute inset-0 overflow-hidden rounded-[1.2rem]">
              {product.image_url && (
                <Image
                  src={product.image_url}
                  alt={product.title}
                  fill
                  priority={priority}
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.05]"
                />
              )}
            </div>
            {badge ? (
              <span className="tilt-layer absolute bottom-2 left-2 rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold text-white shadow-soft [--z:20px]">{badge}</span>
            ) : (
              product.editors_choice && (
                // a bookmark ribbon with a star, tucked over the top edge
                <span title="Editor's choice" className="tilt-layer absolute -top-1 left-3 [--z:22px]">
                  <span className="flex h-10 w-7 items-start justify-center bg-brand pt-1.5 text-[13px] text-white shadow-brand [clip-path:polygon(0_0,100%_0,100%_100%,50%_78%,0_100%)] sm:h-11 sm:w-8">★</span>
                  <span className="sr-only">Editor&apos;s choice</span>
                </span>
              )
            )}
            {price && (
              // a gift tag hanging off the corner; swings when the card is hovered
              <span className="tilt-layer absolute -right-1 top-3 [--z:40px] sm:-right-2">
                <span className="block origin-left rotate-[7deg] drop-shadow-[0_6px_10px_rgb(28_25_23/0.25)] transition-transform duration-500 group-hover:-rotate-[4deg]">
                  <span className="flex items-center gap-1.5 bg-ink py-1 pr-2.5 pl-4 font-display text-xs font-bold text-white [clip-path:polygon(9px_0,100%_0,100%_100%,9px_100%,0_50%)] sm:text-[13px]">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-paper/90" />
                    {price}
                  </span>
                </span>
              </span>
            )}
          </div>

          <div className="tilt-layer flex flex-1 flex-col px-1.5 pt-2.5 pb-1.5 [--z:14px] sm:px-2 sm:pt-3">
            {product.category && <p className="truncate text-[10px] font-bold tracking-[0.12em] text-muted uppercase sm:text-[11px]">{product.category}</p>}
            <h3 className="mt-0.5 line-clamp-2 font-display text-[14px] leading-snug font-bold tracking-tight sm:text-[15px]">{product.title.trim()}</h3>
            {reason && <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-muted">{reason}</p>}
            {liked != null && (
              <p className="mt-auto pt-2.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-bold text-brand-ink sm:text-xs">♥ {liked}% loved it</span>
              </p>
            )}
          </div>
        </article>
      </Tilt>
    </Link>
  );
}

export function ProductGrid({ products, priorityCount = 0 }: { products: Product[]; priorityCount?: number }) {
  return (
    <div className={PRODUCT_GRID}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < priorityCount} />
      ))}
    </div>
  );
}
