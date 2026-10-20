import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Read the SmartGiftMatch Terms of Use covering acceptable use, affiliate links and commissions, partner subscriptions, IP and liability limits.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      path="/terms"
      updated="January 1, 2025"
      intro="By using SmartGiftMatch, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use."
    >
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing and using SmartGiftMatch, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these
        terms, please do not use our service.
      </p>

      <h2>2. Use of Service</h2>
      <p>
        SmartGiftMatch provides gift recommendation services to help users find suitable gifts. You agree to use the service only for lawful purposes and in
        accordance with these Terms.
      </p>
      <ul>
        <li>You must be at least 13 years old to use this service</li>
        <li>You agree not to misuse our service or help anyone else do so</li>
        <li>You will not attempt to interfere with the proper functioning of the service</li>
      </ul>

      <h2>3. Affiliate Links and Commissions</h2>
      <p>
        SmartGiftMatch participates in various affiliate marketing programs. This means we may earn commissions on purchases made through links on our
        website. These commissions help us maintain and improve our free gift recommendation service. The prices you pay are not affected by our affiliate
        relationships. See our <Link href="/affiliate-disclosure">Affiliate Disclosure</Link> for details.
      </p>

      <h2>4. Partner Subscriptions</h2>
      <p>Partners who wish to list products on SmartGiftMatch must maintain an active subscription:</p>
      <ul>
        <li>Subscriptions are billed monthly</li>
        <li>Partners can cancel at any time</li>
        <li>Refunds are not provided for partial months</li>
        <li>Product listings may be removed if subscription lapses</li>
        <li>Partners are responsible for maintaining the confidentiality of their account</li>
      </ul>

      <h2>5. Intellectual Property</h2>
      <p>
        All content on SmartGiftMatch, including but not limited to text, graphics, logos, and software, is owned by or licensed to SmartGiftMatch and is
        protected by copyright and other intellectual property laws.
      </p>
      <p>
        Some visual content may be generated using third-party tools or provided under appropriate commercial licenses. You may not reproduce, distribute, or
        create derivative works without our express written permission.
      </p>

      <h2>6. Disclaimer of Warranties</h2>
      <p>
        SmartGiftMatch is provided &quot;as is&quot; without warranties of any kind, either express or implied. We do not guarantee that our recommendations
        will meet your specific needs or that products will be available at the prices shown. We are not responsible for the quality, safety, or legality of
        products sold by third-party merchants.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        SmartGiftMatch shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability
        to use the service. This includes but is not limited to damages for loss of profits, data, or other intangible losses.
      </p>

      <h2>8. User Content</h2>
      <p>
        By submitting content to SmartGiftMatch (such as reviews or comments), you grant us a worldwide, non-exclusive, royalty-free license to use,
        reproduce, modify, and display that content in connection with our service.
      </p>

      <h2>9. Changes to Terms</h2>
      <p>
        We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of
        SmartGiftMatch after changes are posted constitutes acceptance of the modified terms.
      </p>

      <h2>10. Contact Information</h2>
      <p>
        If you have questions about these Terms of Use, please contact us at <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </LegalPage>
  );
}
