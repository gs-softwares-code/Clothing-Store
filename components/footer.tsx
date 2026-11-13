import Link from "next/link";
import { Container } from "./ui/container";
import { IconFacebook, IconInstagram, IconYoutube } from "./ui/icon";
import { NewsletterForm } from "./newsletter-form";
import { subcatHref } from "@/lib/domain/navigation";
import { CATEGORIES } from "@/lib/domain/categories";

const SHOP_LINKS = CATEGORIES.map((c) => ({ label: c.label, href: `/${c.id}` })).concat([
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Sale", href: "/sale" },
]);

const HELP_LINKS = [
  { label: "Delivery information", href: "/help/delivery-returns" },
  { label: "Returns & exchanges", href: "/help/delivery-returns" },
  { label: "Size guide", href: "/help/size-guide" },
  { label: "Payment options", href: "/help/payment" },
  { label: "Track your order", href: "/help/track" },
  { label: "Contact us", href: "/help/contact" },
];

const COMPANY_LINKS = [
  { label: "About FORME", href: "/about" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Careers", href: "/careers" },
  { label: "Press", href: "/press" },
  { label: "Stores", href: "/stores" },
];

const POPULAR_SUBS = [
  { label: "Women's T-shirts", href: subcatHref("women", "t-shirts") },
  { label: "Men's Shirts", href: subcatHref("men", "shirts") },
  { label: "Women's Outerwear", href: subcatHref("women", "outerwear") },
  { label: "Men's Jeans", href: subcatHref("men", "jeans") },
  { label: "Kids' Outerwear", href: subcatHref("kids", "outerwear") },
  { label: "Baby Bodysuits", href: subcatHref("baby", "bodysuits") },
];

export function Footer() {
  return (
    <footer className="bg-cream">
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-display text-2xl font-bold tracking-[0.22em] text-ink">FORME</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Contemporary everyday clothing, designed to be lived in. Minimal form, considered function, honest materials.
            </p>
            <div className="mt-5 flex gap-3">
              {[
                { label: "Instagram", Icon: IconInstagram },
                { label: "Facebook", Icon: IconFacebook },
                { label: "YouTube", Icon: IconYoutube },
              ].map(({ label, Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center border border-line text-ink transition-colors hover:border-ink"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink">Shop</p>
              <ul className="space-y-2.5">
                {SHOP_LINKS.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="text-sm text-muted transition-colors hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink">Popular</p>
              <ul className="space-y-2.5">
                {POPULAR_SUBS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-muted transition-colors hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink">Help</p>
              <ul className="space-y-2.5">
                {HELP_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-muted transition-colors hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 border-t border-line pt-10 lg:grid-cols-2">
          <div>
            <p className="font-display text-lg font-semibold text-ink">Join the FORME list</p>
            <p className="mt-1 text-sm text-muted">
              New arrivals, early access to collections, and 10% off your first order.
            </p>
            <div className="mt-4 max-w-md">
              <NewsletterForm />
            </div>
          </div>
          <div className="flex flex-col justify-end gap-4 lg:items-end">
            <div className="flex flex-wrap gap-2">
              {COMPANY_LINKS.slice(0, 4).map((l) => (
                <Link key={l.label} href={l.href} className="text-sm text-muted transition-colors hover:text-ink">
                  {l.label}
                </Link>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-muted">
              FORME is a fictional fashion retail brand created as a demonstration project.
              <br />
              Digital Commerce Experience by <Link href="/showcase" className="underline underline-offset-2 hover:text-ink">GS Softwares</Link>.
            </p>
          </div>
        </div>
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col items-center justify-between gap-2 py-4 sm:flex-row">
          <p className="text-xs text-muted">© 2026 FORME. All rights reserved.</p>
          <div className="flex gap-4">
            {["Privacy", "Terms", "Cookies"].map((l) => (
              <Link key={l} href="#" className="text-xs text-muted hover:text-ink">
                {l}
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}
