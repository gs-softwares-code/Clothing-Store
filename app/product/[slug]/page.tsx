import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductGrid } from "@/components/product-grid";
import { ProductDetail } from "@/components/product-detail";
import { RecentlyViewed } from "@/components/recently-viewed";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/catalog";
import { formatINR } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { products } = await import("@/lib/data/catalog");
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description.slice(0, 155),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 155),
      images: [{ url: product.images[0], width: 900, height: 1200, alt: product.name }],
    },
  };
}

const jsonLd = (product: NonNullable<ReturnType<typeof getProductBySlug>>) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description: product.description,
  image: product.images,
  sku: product.id,
  category: `${product.category}/${product.subcategory}`,
  offers: {
    "@type": "Offer",
    priceCurrency: "INR",
    price: product.discountPrice ?? product.price,
    availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
  },
});

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(product)) }}
      />
      <section className="py-6 md:py-10">
        <Container>
          <Breadcrumbs
            items={[
              { label: product.category === "women" ? "Women" : product.category === "men" ? "Men" : product.category === "kids" ? "Kids" : "Baby", href: `/${product.category}` },
              { label: product.subcategory.replace("-", " "), href: `/${product.category}/${product.subcategory}` },
              { label: product.name },
            ]}
          />
          <ProductDetail product={product} />
        </Container>
      </section>

      <section className="pb-14 md:pb-20">
        <Container>
          <SectionHeading
            eyebrow="Complete the look"
            title="You may also like"
            linkHref={`/${product.category}`}
            linkLabel={`More ${product.category}`}
          />
          <ProductGrid products={related} />
        </Container>
      </section>

      <section className="pb-14 md:pb-20">
        <Container>
          <RecentlyViewed currentSlug={product.slug} />
        </Container>
      </section>
    </>
  );
}
