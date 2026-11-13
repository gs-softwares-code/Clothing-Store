import Link from "next/link";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductGrid } from "@/components/product-grid";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { Reveal } from "@/components/ui/reveal";
import { IconArrowRight } from "@/components/ui/icon";
import {
  getBestSellers,
  getCollectionProducts,
  getFeaturedProducts,
  getNewArrivals,
  getSaleProducts,
} from "@/lib/data/catalog";

const heroImg = "photo-1515886657613-9f3515b0c78f";
const womenImg = "photo-1524504388940-b1c1722653e1";
const menImg = "photo-1507003211169-0a1dd7228f2d";
const kidsImg = "photo-1516627145497-ae6968895b74";
const babyImg = "photo-1503919545889-aef636e10ad4";
const seasonalImg = "photo-1544022613-e87ca75a784a";
const storyImg = "photo-1490481651871-ab68de25d43d";
const saleImg = "photo-1483985988355-763728e1935b";

const u = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&q=80&auto=format&fit=crop`;

export const metadata = {
  title: "FORME — Contemporary Everyday Clothing",
  description:
    "Minimalist fashion, functional design, premium essentials. Shop women, men, kids and baby at FORME.",
};

/** Staggered delays for the hero entrance (ms). */
const HERO_DELAYS = [0, 90, 180, 270, 370];

const HIGHLIGHTS = [
  "Free delivery over ₹1,999",
  "Easy 7-day returns",
  "Garment-dyed colourways",
  "New pieces weekly",
  "Carbon-neutral shipping",
];

function StoreHighlightsMarquee() {
  return (
    <div
      aria-label="Store highlights"
      className="marquee relative overflow-hidden bg-accent-deep py-3"
    >
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1}
            className="flex items-center gap-10 pr-10"
          >
            {HIGHLIGHTS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-10 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.22em] text-white/85"
              >
                <span>{item}</span>
                <span aria-hidden="true" className="text-white/40">
                  ✦
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const newArrivals = getNewArrivals(8);
  const bestSellers = getBestSellers(8);
  const essentials = getCollectionProducts("modern-essentials").slice(0, 8);
  const featured = getFeaturedProducts(8);
  const sale = getSaleProducts().slice(0, 4);

  return (
    <>
      {/* ============ HERO ============ */}
      <section aria-label="Featured campaign" className="bg-cream">
        <Container className="grid items-stretch gap-0 py-6 lg:grid-cols-12 lg:gap-10 lg:py-10">
          <div className="flex flex-col justify-center py-10 lg:col-span-5 lg:py-16">
            <p
              className="hero-enter mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-accent"
              style={{ animationDelay: `${HERO_DELAYS[0]}ms` }}
            >
              The new season
            </p>
            <h1
              className="hero-enter font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink md:text-5xl xl:text-6xl"
              style={{ animationDelay: `${HERO_DELAYS[1]}ms` }}
            >
              The art of
              <br />
              <span className="text-accent">everyday</span>
            </h1>
            <p
              className="hero-enter mt-5 max-w-md text-base leading-relaxed text-muted"
              style={{ animationDelay: `${HERO_DELAYS[2]}ms` }}
            >
              Considered clothing for the rhythm of real life — minimal silhouettes,
              honest materials, and pieces designed to be worn, not just looked at.
            </p>
            <div
              className="hero-enter mt-8 flex flex-wrap gap-3"
              style={{ animationDelay: `${HERO_DELAYS[3]}ms` }}
            >
              <LinkButton href="/women">Shop Women</LinkButton>
              <LinkButton href="/men" variant="outline">Shop Men</LinkButton>
            </div>
            <div
              className="hero-enter mt-10 flex gap-8 border-t border-line pt-6"
              style={{ animationDelay: `${HERO_DELAYS[4]}ms` }}
            >
              {[
                { k: "40+", v: "styles in season" },
                { k: "7", v: "day easy returns" },
                { k: "Free", v: "delivery over ₹1,999" },
              ].map((s) => (
                <div key={s.v}>
                  <p className="font-display text-xl font-bold text-ink">{s.k}</p>
                  <p className="text-xs text-muted">{s.v}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-[16/11]">
              <ImageWithFallback
                src={u(heroImg, 1200, 900)}
                alt="FORME editorial campaign — minimal everyday fashion"
                fill
                priority
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="hero-zoom object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/10 to-transparent" />
            </div>
          </div>
        </Container>
      </section>

      {/* ============ ANNOUNCEMENT MARQUEE ============ */}
      <StoreHighlightsMarquee />

      {/* ============ CATEGORY TILES ============ */}
      <section aria-label="Shop by category" className="py-14 md:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Shop by category"
              title="Four families, one philosophy"
              description="Curated for every member of the household — same taste, different cut."
            />
          </Reveal>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {[
              { label: "Women", href: "/women", img: womenImg },
              { label: "Men", href: "/men", img: menImg },
              { label: "Kids", href: "/kids", img: kidsImg },
              { label: "Baby", href: "/baby", img: babyImg },
            ].map((t, i) => (
              <Reveal key={t.label} delay={i * 90}>
                <Link href={t.href} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-cream">
                    <ImageWithFallback
                      src={u(t.img, 600, 800)}
                      alt={`${t.label} collection`}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 to-transparent p-4 pt-12">
                      <span className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.16em] text-white">
                        {t.label}
                        <IconArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ============ NEW ARRIVALS ============ */}
      <section aria-label="New arrivals" className="pb-14 md:pb-20">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Just in"
              title="New arrivals"
              description="Fresh pieces, garment-dyed colourways, and the season’s newest layers."
              linkHref="/new-arrivals"
              linkLabel="View all arrivals"
            />
          </Reveal>
          <Reveal delay={100}>
            <ProductGrid products={newArrivals} stagger />
          </Reveal>
        </Container>
      </section>

      {/* ============ SEASONAL CAMPAIGN ============ */}
      <section aria-label="Seasonal Layers campaign" className="bg-ink text-white">
        <Container className="grid items-center gap-8 py-14 lg:grid-cols-2 lg:py-20">
          <div className="order-2 lg:order-1">
            <Reveal variant="slide-left">
              <div className="relative aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src={u(seasonalImg, 1000, 750)}
                  alt="Seasonal layers campaign — outerwear"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                />
              </div>
            </Reveal>
          </div>
          <div className="order-1 lg:order-2">
            <Reveal variant="slide-right">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">
                Collection 03
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                Seasonal Layers
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">
                Outerwear engineered for the in-between — light enough for the first chill,
                structured enough for the full winter. Designed to layer, built to last.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <LinkButton href="/collections/seasonal-layers" variant="light">
                  Explore the collection
                </LinkButton>
                <LinkButton href="/women/outerwear" variant="ghost" className="text-white hover:bg-white/10">
                  Women’s outerwear
                </LinkButton>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ============ BEST SELLERS ============ */}
      <section aria-label="Best sellers" className="py-14 md:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Most loved"
              title="Best sellers"
              description="The pieces our customers re-order, gift, and never send back."
              linkHref="/sale"
              linkLabel="Shop the sale"
            />
          </Reveal>
          <Reveal delay={100}>
            <ProductGrid products={bestSellers} stagger />
          </Reveal>
        </Container>
      </section>

      {/* ============ ESSENTIALS STRIP ============ */}
      <section aria-label="Modern essentials" className="border-y border-line bg-cream py-14 md:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="The foundation"
              title="Modern essentials"
              description="The building blocks of a working wardrobe — improved, not invented."
              linkHref="/collections/modern-essentials"
              linkLabel="Explore essentials"
            />
          </Reveal>
          <Reveal delay={100}>
            <ProductGrid products={essentials} columns={4} stagger />
          </Reveal>
        </Container>
      </section>

      {/* ============ EDITORIAL STORY ============ */}
      <section aria-label="The Art of Simplicity" className="py-14 md:py-24">
        <Container className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <Reveal variant="slide-right">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
              Our philosophy
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
              The art of simplicity
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
              We believe fewer, better things make for a richer life. Every FORME piece
              is reduced to its essential function, then refined until it earns its
              place in your rotation. That is the whole design brief.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {[
                { k: "01", v: "Considered materials" },
                { k: "02", v: "Precise, simple cuts" },
                { k: "03", v: "Built for the long run" },
              ].map((x) => (
                <div key={x.k} className="border-t border-line pt-3">
                  <p className="font-display text-lg font-bold text-accent">{x.k}</p>
                  <p className="mt-1 text-sm text-muted">{x.v}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <LinkButton href="/collections/art-of-simplicity" variant="outline">
                Read the story
              </LinkButton>
            </div>
          </Reveal>
          <Reveal variant="slide-left">
            <div className="relative aspect-[4/5] overflow-hidden bg-cream">
              <ImageWithFallback
                src={u(storyImg, 1000, 1250)}
                alt="Editorial photography — the art of simplicity"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ============ SALE BANNER ============ */}
      <section aria-label="Sale" className="pb-14 md:pb-20">
        <Container>
          <Reveal variant="scale-in">
            <div className="relative overflow-hidden bg-sale-tint">
              <div className="grid items-center gap-6 p-8 md:grid-cols-2 md:p-12">
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sale">
                    Limited time
                  </p>
                  <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
                    The seasonal edit — now up to 30% off
                  </h2>
                  <p className="mt-3 max-w-md text-sm text-muted">
                    A quietly considered selection of the season, marked down to make room
                    for the next.
                  </p>
                  <div className="mt-6">
                    <LinkButton href="/sale">
                      Shop the sale
                      <IconArrowRight size={16} />
                    </LinkButton>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <ImageWithFallback
                      src={u(saleImg, 900, 563)}
                      alt="FORME sale campaign"
                      fill
                      sizes="(min-width: 768px) 50vw, 0vw"
                      className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ============ HOT RIGHT NOW ============ */}
      <section aria-label="Featured products" className="pb-16 md:pb-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Curated"
              title="Hot right now"
              description="The pieces our community is reaching for this week."
              linkHref="/collections"
              linkLabel="All collections"
            />
          </Reveal>
          <Reveal delay={100}>
            <ProductGrid products={featured} stagger />
          </Reveal>
        </Container>
      </section>

      {/* ============ SALE STRIP (small) ============ */}
      {sale.length > 0 && (
        <section aria-label="Sale picks" className="pb-14">
          <Container>
            <Reveal>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {sale.map((p) => (
                  <Link key={p.id} href={`/product/${p.slug}`} className="group">
                    <div className="relative aspect-[3/4] overflow-hidden bg-cream">
                      <ImageWithFallback
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                      <span className="absolute left-3 top-3 bg-sale px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                        Sale
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </Reveal>
          </Container>
        </section>
      )}
    </>
  );
}
