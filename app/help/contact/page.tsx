import type { Metadata } from "next";
import { InfoPage, InfoSection } from "@/components/info-page";

export const metadata: Metadata = { title: "Contact us" };

export default function ContactPage() {
  return (
    <InfoPage crumb="Contact us" title="Contact us" lede="Our care team is here Monday–Saturday, 9:00–18:00 IST.">
      <InfoSection title="Email">
        <p>
          <a href="mailto:care@forme.example" className="text-accent underline underline-offset-2">
            care@forme.example
          </a>
        </p>
      </InfoSection>
      <InfoSection title="Phone">
        <p>1800-000-0000 (toll-free within India)</p>
      </InfoSection>
      <InfoSection title="Head office">
        <p>
          FORME (fictional brand)
          <br />
          Level 4, 100 MG Road
          <br />
          Bengaluru, Karnataka 560001, India
        </p>
      </InfoSection>
    </InfoPage>
  );
}
