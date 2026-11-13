import type { Metadata } from "next";
import { InfoPage, InfoSection } from "@/components/info-page";

export const metadata: Metadata = { title: "About FORME" };

export default function AboutPage() {
  return (
    <InfoPage
      crumb="About"
      title="About FORME"
      lede="Contemporary everyday clothing — minimal form, considered function, honest materials."
    >
      <InfoSection title="Why FORME">
        <p>
          FORME began with a simple argument: most of a wardrobe is made of a few
          pieces worn constantly. Those pieces deserve to be exceptional. We design
          and engineer them with the same care a serious brand would give a flagship
          garment — then keep the price accessible.
        </p>
      </InfoSection>
      <InfoSection title="What we believe">
        <ul className="list-disc space-y-1 pl-5">
          <li>Fewer, better pieces beat more, middling ones.</li>
          <li>Cutting and material do the talking; decoration is mostly noise.</li>
          <li>Clothing should make the day easier, not harder.</li>
          <li>Comfort and composure are not opposites.</li>
        </ul>
      </InfoSection>
      <InfoSection title="FORME is a fictional brand">
        <p>
          FORME was created as a demonstration project by GS Softwares to showcase
          premium e-commerce engineering. It is not a real company, and no products
          are actually sold.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
