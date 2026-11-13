import type { Metadata } from "next";
import { InfoPage, InfoSection, InfoNote } from "@/components/info-page";

export const metadata: Metadata = { title: "Payment options" };

export default function PaymentPage() {
  return (
    <InfoPage crumb="Payment options" title="Payment options" lede="Simple, secure payment at checkout.">
      <InfoSection title="Accepted methods">
        <ul className="list-disc space-y-1 pl-5">
          <li>Credit and debit cards (Visa, Mastercard, RuPay, Amex)</li>
          <li>UPI</li>
          <li>Net banking</li>
          <li>Cash on delivery (selected pincodes)</li>
        </ul>
      </InfoSection>
      <InfoSection title="Security">
        <p>
          All transactions are encrypted in transit, and card details are never stored
          on our servers.
        </p>
      </InfoSection>
      <InfoNote>
        This store is a demonstration project. The checkout flow simulates payment
        only — no real transaction is processed, and no card data should be entered.
      </InfoNote>
    </InfoPage>
  );
}
