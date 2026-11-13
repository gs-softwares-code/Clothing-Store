import type { Metadata } from "next";
import { InfoPage, InfoSection } from "@/components/info-page";

export const metadata: Metadata = { title: "Delivery & returns" };

export default function DeliveryReturnsPage() {
  return (
    <InfoPage
      crumb="Delivery & returns"
      title="Delivery & returns"
      lede="Straightforward delivery options and a no-drama returns policy."
    >
      <InfoSection title="Delivery options">
        <p>
          <strong className="text-ink">Standard delivery</strong> — 3–5 business days,
          ₹199. Free on all orders of ₹1,999 or more.
        </p>
        <p>
          <strong className="text-ink">Express delivery</strong> — 1–2 business days,
          ₹399. Available at checkout on eligible pincodes.
        </p>
        <p>
          Orders are dispatched within 24 hours on business days from our fulfilment
          centre. You will receive a dispatch confirmation by email.
        </p>
      </InfoSection>
      <InfoSection title="Returns">
        <p>
          We accept returns within <strong className="text-ink">7 days</strong> of
          delivery. Items must be unused, unworn, and returned with all tags attached.
        </p>
        <p>
          To start a return, contact our care team with your order reference. Refunds
          are issued to the original payment method within 5–7 business days of the
          item reaching us.
        </p>
        <p>
          Exchanges are free on domestic orders — just let us know what you would like
          instead.
        </p>
      </InfoSection>
      <InfoSection title="Missing or damaged items">
        <p>
          If an order arrives damaged or incomplete, photograph the package and email
          our care team within 48 hours of delivery. We will replace the items or
          refund in full.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
