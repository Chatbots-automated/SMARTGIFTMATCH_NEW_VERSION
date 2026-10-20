import { getProductBySlug } from "@/lib/data";

// Outbound affiliate hop. Keeps affiliate URLs out of the crawlable page
// and gives one place to add click tracking later.
export async function GET(_request: Request, { params }: RouteContext<"/go/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product?.affiliate_url) {
    return Response.redirect(new URL(`/gift/${slug}`, _request.url), 302);
  }
  return new Response(null, {
    status: 302,
    headers: { Location: product.affiliate_url, "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store" },
  });
}
