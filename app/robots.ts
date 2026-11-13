import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/order-confirmation/", "/showcase"],
    },
    sitemap: "https://forme-demo.vercel.app/sitemap.xml",
  };
}
