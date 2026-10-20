import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how SmartGiftMatch collects, uses and protects your information, which service providers we rely on, and the privacy rights and choices available to you.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy"
      updated="January 1, 2025"
      intro="Your privacy is important to us. We are committed to protecting your personal information and being transparent about our data practices."
    >
      <h2>1. Information We Collect</h2>
      <p>We collect information to provide better services to our users. The types of information we collect include:</p>
      <ul>
        <li><strong>Partner Account Information:</strong> Email address, password, and subscription details for partner accounts</li>
        <li><strong>Usage Data:</strong> Quiz responses, gift preferences, and browsing behavior</li>
        <li><strong>Technical Information:</strong> IP address, browser type, device information, and cookies</li>
        <li><strong>Transaction Data:</strong> Payment information processed through Stripe (we do not store full credit card details)</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use the collected information for the following purposes:</p>
      <ul>
        <li>Providing personalized gift recommendations</li>
        <li>Processing partner subscriptions and payments</li>
        <li>Improving our matching algorithm and user experience</li>
        <li>Analyzing usage patterns and trends</li>
        <li>Communicating with you about service updates</li>
        <li>Preventing fraud and ensuring platform security</li>
      </ul>

      <h2>3. Cookies and Tracking Technologies</h2>
      <p>
        We use cookies and similar tracking technologies to track activity on our service and store certain information. Cookies help us remember your
        preferences, understand how you use our service, and provide relevant recommendations. You can configure your browser to refuse all cookies or to
        indicate when a cookie is being sent.
      </p>

      <h2>4. Information Sharing and Disclosure</h2>
      <p>We do not sell your personal information. We may share your information only in the following circumstances:</p>
      <ul>
        <li><strong>With Your Consent:</strong> When you explicitly agree to share information</li>
        <li><strong>Service Providers:</strong> With trusted third parties who assist in operating our service (e.g., Stripe for payments, Supabase for data storage)</li>
        <li><strong>Affiliate Partners:</strong> When you click on affiliate links, certain information may be shared with merchants to track referrals</li>
        <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
      </ul>

      <h2>5. Data Security</h2>
      <p>
        We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration,
        disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
      </p>

      <h2>6. Data Retention</h2>
      <p>
        We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy. Account data for partners
        is retained as long as the account is active. Usage data and anonymous analytics may be retained indefinitely for service improvement purposes.
      </p>

      <h2>7. Your Rights and Choices</h2>
      <p>You have the following rights regarding your personal information:</p>
      <ul>
        <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
        <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
        <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
        <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
        <li><strong>Data Portability:</strong> Request transfer of your data to another service</li>
      </ul>

      <h2>8. Children&apos;s Privacy</h2>
      <p>
        SmartGiftMatch is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you
        become aware that a child has provided us with personal information, please contact us, and we will take steps to delete such information.
      </p>

      <h2>9. International Data Transfers</h2>
      <p>
        Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data
        protection laws. By using SmartGiftMatch, you consent to such transfers.
      </p>

      <h2>10. Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating
        the &quot;Last updated&quot; date. Continued use of the service after changes constitutes acceptance of the updated policy.
      </p>

      <h2>11. Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact us at{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or visit our <Link href="/contact">contact page</Link>.
      </p>
    </LegalPage>
  );
}
