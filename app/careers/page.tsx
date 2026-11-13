import type { Metadata } from "next";
import { InfoPage, InfoSection } from "@/components/info-page";

export const metadata: Metadata = { title: "Careers" };

export default function CareersPage() {
  return (
    <InfoPage crumb="Careers" title="Careers" lede="Build the everyday with us.">
      <InfoSection title="Open roles (illustrative)">
        <ul className="list-disc space-y-1 pl-5">
          <li>Senior Product Designer — Womenswear</li>
          <li>Garment Technologist</li>
          <li>E-commerce Engineering Lead</li>
          <li>Supply Chain Operations Manager</li>
        </ul>
      </InfoSection>
      <InfoSection title="How to apply">
        <p>
          Send your details to{" "}
          <a href="mailto:talent@forme.example" className="text-accent underline underline-offset-2">
            talent@forme.example
          </a>{" "}
          with the role in the subject line.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
