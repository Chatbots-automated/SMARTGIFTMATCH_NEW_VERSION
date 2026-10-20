import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description:
    "How SmartGiftMatch uses affiliate links and brand partnerships, how we earn commissions at no extra cost to you, and how we keep our gift picks honest and fair.",
  alternates: { canonical: "/affiliate-disclosure" },
};

export default function AffiliateDisclosurePage() {
  return (
    <LegalPage
      title="Affiliate Disclosure"
      path="/affiliate-disclosure"
      intro="Transparency is our priority. Here's how we maintain honest, user-first gift recommendations."
    >
      <p>
        SmartGiftMatch participates in various affiliate marketing programmes. This means that some links on our website are affiliate links.
      </p>
      <p>
        If you click on an affiliate link and make a purchase, SmartGiftMatch may earn a commission from the retailer. This commission comes at no additional
        cost to you.
      </p>
      <p>Some outgoing links may be tracked for attribution purposes.</p>
      <p>
        Some brands featured on SmartGiftMatch may participate in subscription-based partnership programmes that provide defined levels of visibility on the
        platform. Visibility levels relate to placement and exposure only. Product inclusion is subject to relevance, quality standards, and platform
        guidelines.
      </p>

      <h2>Our Commitment</h2>
      <p>
        Affiliate relationships or paid partnerships do not imply endorsement of any product or brand. We strive to maintain honest, unbiased, and user-first
        recommendations at all times.
      </p>
      <p>
        SmartGiftMatch complies with applicable advertising and consumer protection regulations, including FTC guidelines in the United States and relevant
        EU transparency requirements.
      </p>
      <p>
        We encourage users to review the retailer&apos;s own terms, conditions, and privacy policies before making a purchase.
      </p>

      <h2>Questions?</h2>
      <p>
        Have questions about our affiliate practices? <Link href="/contact">Contact us</Link>.
      </p>
    </LegalPage>
  );
}
