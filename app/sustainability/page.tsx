import type { Metadata } from "next";
import { InfoPage, InfoSection } from "@/components/info-page";

export const metadata: Metadata = { title: "Sustainability" };

export default function SustainabilityPage() {
  return (
    <InfoPage
      crumb="Sustainability"
      title="Sustainability"
      lede="Our approach is straightforward: make fewer things, make them well, and make them last."
    >
      <InfoSection title="Materials">
        <p>
          We favour organic cotton, responsibly sourced wool, and recycled synthetics
          across the catalogue. Every material is listed on its product page.
        </p>
      </InfoSection>
      <InfoSection title="Longevity">
        <p>
          A FORME piece is designed to be repaired, not replaced — reinforced seams,
          garment-washed finishes, and classic silhouettes that do not date.
        </p>
      </InfoSection>
      <InfoSection title="Packaging">
        <p>
          Shipments use recycled and recyclable packaging, with no single-use plastic
          in the box.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
