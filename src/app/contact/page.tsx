import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with SmartGiftMatch for support, feedback, brand partnerships or general questions. Email our team and we typically reply within 24-48 hours.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <LegalPage
      title="Contact Us"
      path="/contact"
      intro="Have questions, feedback, or need assistance? We'd love to hear from you!"
    >
      <h2>Email Us</h2>
      <p>For all inquiries, support, partnerships, and general questions:</p>
      <p>
        <strong>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        </strong>
      </p>

      <h2>Response Time</h2>
      <p>We typically respond to all inquiries within 24-48 hours during business days.</p>
    </LegalPage>
  );
}
