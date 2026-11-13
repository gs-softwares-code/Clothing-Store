import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LinkButton } from "@/components/ui/button";
import { IconArrowRight, IconCheck } from "@/components/ui/icon";

export const metadata: Metadata = {
  title: "Showcase — GS Softwares",
  robots: { index: false, follow: false },
};

const STACK = [
  "Next.js 16 (App Router)",
  "React 19",
  "TypeScript",
  "Tailwind CSS 4",
  "Zod validation",
  "Drizzle ORM schema (Neon PostgreSQL-ready)",
  "REST API v1 (server-validated)",
  "Vitest + Playwright (QA)",
];

const CAPABILITIES = [
  ["Editorial e-commerce design system", "A consistent design language — tokens, typography, components — not one-off styling."],
  ["Full shopping journey", "Browse, filter, sort, search, variants, cart, wishlist, checkout, confirmation."],
  ["Server + client architecture", "Server components for content, client islands for interactivity, minimal JS."],
  ["Validated API layer", "Zod everywhere; prices and totals recalculated server-side."],
  ["Accessibility", "ARIA dialogs, focus traps, keyboard navigation, semantic HTML."],
  ["Performance & SEO", "Static generation, lazy images, metadata, structured data, sitemap."],
] as const;

export default function ShowcasePage() {
  return (
    <section className="py-8 md:py-14">
      <Container className="max-w-4xl">
        <Breadcrumbs items={[{ label: "Showcase" }]} />

        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
          GS Softwares — Case study
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
          FORME Fashion Commerce
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted">
          A complete, production-quality e-commerce platform for a fictional fashion
          retailer — engineered end-to-end by GS Softwares to demonstrate how we
          design and build serious retail experiences.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <LinkButton href="/">View the storefront</LinkButton>
          <LinkButton href="/women" variant="outline">Shop women</LinkButton>
        </div>

        <div className="mt-10 space-y-10">
          <section>
            <h2 className="font-display text-xl font-semibold text-ink">The project</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
              <p>
                <strong className="text-ink">Client concept:</strong> a fictional,
                international fashion retailer (FORME) needing a premium online store —
                editorial in feel, rigorous in function.
              </p>
              <p>
                <strong className="text-ink">Problem demonstrated:</strong> most retail
                builds fail somewhere — a beautiful store that cannot transact, or a
                transactional store that feels generic. FORME resolves both: an
                editorial, lifestyle-led storefront with a complete, correct shopping
                engine underneath.
              </p>
              <p>
                <strong className="text-ink">Deliverable:</strong> a responsive
                multi-page store with 57 seeded products, full commerce flows, a
                versioned API, and a demo checkout — deployable as-is or extended to a
                database-backed architecture.
              </p>
              <p className="text-xs text-faint">
                FORME is a fictional demonstration. No real clients, revenue, or
                business metrics are represented on this page.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">E-commerce functionality</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {CAPABILITIES.map(([title, body]) => (
                <li key={title} className="border border-line p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <IconCheck size={15} className="text-accent" />
                    {title}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">Technology stack</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {STACK.map((t) => (
                <li key={t} className="border border-line bg-cream px-3 py-1.5 text-xs text-ink">
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              The application ships with a demo data adapter (in-memory, seeded) so the
              experience runs with zero configuration. The Drizzle schema, migrations,
              and Postgres adapter are included for drop-in database persistence — see
              <span className="text-ink"> docs/DATABASE.md</span>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">Engineering capabilities demonstrated</h2>
            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-muted">
              <li>• Layered architecture: presentation → components → domain → data adapters.</li>
              <li>• Server-validated transactions; client-side never trusted for prices.</li>
              <li>• Accessible interaction model — drawers, overlays, focus management.</li>
              <li>• Static generation + streaming for strong Core Web Vitals on the critical path.</li>
              <li>• Automated tests: unit, integration, and end-to-end coverage of core journeys.</li>
              <li>• Complete documentation: audit, architecture, database, API, testing, deployment.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink">Explore for yourself</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <LinkButton href="/cart" variant="outline">Open the bag</LinkButton>
              <LinkButton href="/collections" variant="outline">View collections</LinkButton>
              <LinkButton href="/sale" variant="outline">See the sale</LinkButton>
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm text-muted">
              Questions about building your own commerce experience?
              <a href="mailto:hello@gssoftwares.example" className="inline-flex items-center gap-1 text-accent underline underline-offset-2">
                hello@gssoftwares.example <IconArrowRight size={13} />
              </a>
            </p>
          </section>
        </div>
      </Container>
    </section>
  );
}
