import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { IconArrowRight } from "@/components/ui/icon";
import { COLLECTIONS } from "@/lib/domain/categories";

export const metadata: Metadata = {
  title: "Collections",
  description: "FORME collections — The Everyday Collection, Modern Essentials, Seasonal Layers and more.",
};

const IMAGES: Record<string, string> = {
  everyday: "photo-1490481651871-ab68de25d43d",
  "modern-essentials": "photo-1434389677669-e08b4cac3105",
  "seasonal-layers": "photo-1539533018447-63fcce2678e3",
  "art-of-simplicity": "photo-1515886657613-9f3515b0c78f",
  "everyday-comfort": "photo-1627225924765-552d49cf47ad",
};

export default function CollectionsIndexPage() {
  return (
    <section className="py-10 md:py-14">
      <Container>
        <SectionHeading
          eyebrow="FORME"
          title="Collections"
          description="Five narratives, one wardrobe. Explore the collections that define the FORME point of view."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {COLLECTIONS.map((c) => (
            <Link key={c.id} href={`/collections/${c.id}`} className="group block">
              <div className="relative aspect-[16/10] overflow-hidden bg-cream">
                <ImageWithFallback
                  src={`https://images.unsplash.com/${IMAGES[c.id]}?w=1000&q=80&auto=format&fit=crop`}
                  alt={c.label}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/70 to-transparent p-5 pt-16">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-white">{c.label}</h3>
                    <p className="mt-1 max-w-sm text-xs text-white/75">{c.description}</p>
                  </div>
                  <IconArrowRight size={20} className="shrink-0 text-white transition-transform duration-200 group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
