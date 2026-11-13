import type { Metadata } from "next";
import { InfoPage, InfoSection } from "@/components/info-page";

export const metadata: Metadata = { title: "Size guide" };

export default function SizeGuidePage() {
  return (
    <InfoPage
      crumb="Size guide"
      title="Size guide"
      lede="FORME sizing runs true to size. Measurements are garment measurements in centimetres."
    >
      <InfoSection title="Adult — Women & Men">
        <p>If you sit between sizes, size up for a relaxed fit, or size down for a closer silhouette.</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>XS — chest 84–88, waist 60–64</li>
          <li>S — chest 88–92, waist 64–68</li>
          <li>M — chest 92–96, waist 68–72</li>
          <li>L — chest 96–102, waist 72–78</li>
          <li>XL — chest 102–108, waist 78–84</li>
          <li>XXL — chest 108–114, waist 84–90</li>
        </ul>
      </InfoSection>
      <InfoSection title="Kids">
        <ul className="list-disc space-y-1 pl-5">
          <li>2-4Y — height 92–104 cm</li>
          <li>4-6Y — height 104–116 cm</li>
          <li>6-8Y — height 116–128 cm</li>
          <li>8-10Y — height 128–140 cm</li>
          <li>10-12Y — height 140–152 cm</li>
        </ul>
      </InfoSection>
      <InfoSection title="Baby">
        <ul className="list-disc space-y-1 pl-5">
          <li>0-3M — 50–62 cm</li>
          <li>3-6M — 62–68 cm</li>
          <li>6-12M — 68–80 cm</li>
          <li>12-18M — 80–86 cm</li>
          <li>18-24M — 86–92 cm</li>
        </ul>
      </InfoSection>
      <InfoSection title="A note on fit">
        <p>
          Each product page lists the intended fit (regular, relaxed, slim, oversized).
          Check the “Fit & silhouette” section for the piece you are considering.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
