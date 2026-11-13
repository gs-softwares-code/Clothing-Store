import type { Metadata } from "next";
import { InfoPage, InfoSection } from "@/components/info-page";

export const metadata: Metadata = { title: "Press" };

export default function PressPage() {
  return (
    <InfoPage crumb="Press" title="Press" lede="Notes, imagery, and contact for media.">
      <InfoSection title="Press contact">
        <p>
          For images, interviews, and brand notes, email{" "}
          <a href="mailto:press@forme.example" className="text-accent underline underline-offset-2">
            press@forme.example
          </a>.
        </p>
      </InfoSection>
      <InfoSection title="Brand notes">
        <p>
          FORME is a fictional fashion brand created as a demonstration project by GS
          Softwares. Press materials may describe the brand concept, design
          philosophy, and engineering showcase — but not commercial results.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
