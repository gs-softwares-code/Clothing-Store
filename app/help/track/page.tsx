import type { Metadata } from "next";
import { InfoPage, InfoSection, InfoNote } from "@/components/info-page";

export const metadata: Metadata = { title: "Track your order" };

export default function TrackOrderPage() {
  return (
    <InfoPage crumb="Track your order" title="Track your order" lede="Where your FORME order is, at a glance.">
      <InfoSection title="How tracking works">
        <p>
          Every order receives a reference beginning with <strong className="text-ink">FME-</strong>.
          After dispatch, you will also receive a carrier tracking link by email.
        </p>
      </InfoSection>
      <InfoSection title="Typical timeline">
        <ul className="list-disc space-y-1 pl-5">
          <li>Day 0 — order confirmed with reference</li>
          <li>Day 0–1 — dispatched from fulfilment centre</li>
          <li>Day 2–5 — delivered (standard) / day 1–2 (express)</li>
        </ul>
      </InfoSection>
      <InfoNote>
        In this demonstration store, orders live only in server memory. Your reference
        appears on the confirmation screen — there is no real shipment to trace.
      </InfoNote>
    </InfoPage>
  );
}
