import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ShopProvider } from "@/lib/commerce/shop-context";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const SITE_NAME = "FORME";
const SITE_DESCRIPTION =
  "FORME — contemporary everyday clothing. Minimalist design, functional cuts, and honest materials for women, men, kids, and baby.";

export const metadata: Metadata = {
  metadataBase: new URL("https://forme-demo.vercel.app"),
  title: {
    default: `${SITE_NAME} — Modern Essentials`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Modern Essentials`,
    description: SITE_DESCRIPTION,
    locale: "en_IN",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${manrope.variable}`}>
      <body className="flex min-h-screen flex-col">
        <ShopProvider>
          <ToastProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </ToastProvider>
        </ShopProvider>
      </body>
    </html>
  );
}
