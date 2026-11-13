import type { Metadata } from "next";
import { InfoPage, InfoSection, InfoNote } from "@/components/info-page";

export const metadata: Metadata = { title: "Stores" };

const STORES = [
  { city: "Bengaluru", name: "FORME Indiranagar", line: "100 Feet Road, Indiranagar, Bengaluru 560038" },
  { city: "Mumbai", name: "FORME Bandra", line: "Linking Road, Bandra West, Mumbai 400050" },
  { city: "Delhi NCR", name: "FORME Select Citywalk", line: "Select Citywalk, Saket, New Delhi 110017" },
  { city: "Pune", name: "FORME Koregaon Park", line: "North Main Road, Koregaon Park, Pune 411001" },
];

export default function StoresPage() {
  return (
    <InfoPage crumb="Stores" title="Stores" lede="Flagship and studio stores across India.">
      <InfoSection title="Flagship stores">
        <div className="grid gap-4 sm:grid-cols-2">
          {STORES.map((s) => (
            <div key={s.city} className="border border-line p-4">
              <p className="text-sm font-semibold text-ink">{s.name}</p>
              <p className="mt-1 text-sm text-muted">{s.line}</p>
            </div>
          ))}
        </div>
      </InfoSection>
      <InfoSection title="Store services">
        <ul className="list-disc space-y-1 pl-5">
          <li>Try-on and fit advice from our wardrobe team</li>
          <li>In-store pickup for online orders (demo)</li>
          <li>Returns drop-off for online purchases</li>
        </ul>
      </InfoSection>
      <InfoNote>
        FORME is a fictional brand; these store listings are illustrative.
      </InfoNote>
    </InfoPage>
  );
}
