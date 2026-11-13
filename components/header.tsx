"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/domain/navigation";
import { useShop } from "@/lib/commerce/shop-context";
import { cn } from "@/lib/utils";
import { MegaMenu } from "./mega-menu";
import { MobileNav } from "./mobile-nav";
import { SearchOverlay } from "./search-overlay";
import { CartDrawer } from "./cart-drawer";
import { IconBag, IconHeart, IconMenu, IconSearch } from "./ui/icon";

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
      {count > 9 ? "9+" : count}
    </span>
  );
}

export function Header() {
  const [megaOpen, setMegaOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cartCount, wishlist } = useShop();
  const pathname = usePathname();

  // Close overlays on route change
  // (sync with external system: navigation — not a derived-value cascade)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMegaOpen(null);
    setMobileOpen(false);
    setSearchOpen(false);
    setCartOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-50">
        {/* Announcement */}
        <div className="bg-ink text-white">
          <div className="mx-auto flex max-w-[1440px] items-center justify-center gap-2 px-4 py-2 text-center">
            <p className="text-[11px] tracking-[0.08em]">
              Free standard delivery on orders above ₹1,999 — limited time
            </p>
            <Link href="/sale" className="shrink-0 border-b border-white/50 pb-px text-[11px] uppercase tracking-[0.14em] hover:border-white">
              Shop sale
            </Link>
          </div>
        </div>

        {/* Main bar */}
        <div className="border-b border-line bg-canvas">
          <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4 md:px-8 lg:px-12">
            <button
              className="flex h-10 w-10 items-center justify-center text-ink lg:hidden"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <IconMenu />
            </button>

            <Link href="/" className="font-display text-xl font-bold tracking-[0.22em] text-ink" aria-label="FORME home">
              FORME
            </Link>

            {/* Desktop nav */}
            <nav aria-label="Primary" className="ml-10 hidden items-center gap-1 lg:flex">
              {NAV_ITEMS.map((item) => (
                <div key={item.key} className="relative">
                  <button
                    onMouseEnter={() => setMegaOpen(item.key)}
                    onFocus={() => setMegaOpen(item.key)}
                    aria-expanded={megaOpen === item.key}
                    className={cn(
                      "px-3 py-2 text-[13px] font-medium uppercase tracking-[0.12em] transition-colors hover:text-accent",
                      megaOpen === item.key && "text-accent",
                      pathname === item.href && "text-accent",
                    )}
                  >
                    {item.label}
                  </button>
                </div>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-1">
              <button
                aria-label="Open search"
                onClick={() => setSearchOpen(true)}
                className="flex h-10 w-10 items-center justify-center text-ink hover:bg-cream"
              >
                <IconSearch />
              </button>
              <Link
                href="/wishlist"
                aria-label={`Wishlist, ${wishlist.length} items`}
                className="relative hidden h-10 w-10 items-center justify-center text-ink hover:bg-cream sm:flex"
              >
                <IconHeart />
                <CountBadge count={wishlist.length} />
              </Link>
              <button
                aria-label={`Shopping bag, ${cartCount} items`}
                onClick={() => setCartOpen(true)}
                className="relative flex h-10 w-10 items-center justify-center text-ink hover:bg-cream"
              >
                <IconBag />
                <CountBadge count={cartCount} />
              </button>
            </div>
          </div>

          <MegaMenu openKey={megaOpen} onNavigate={() => setMegaOpen(null)} />
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
