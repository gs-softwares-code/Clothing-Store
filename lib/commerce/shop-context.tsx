"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/domain/types";

const CART_KEY = "forme.cart.v1";
const WISHLIST_KEY = "forme.wishlist.v1";

interface ShopContextValue {
  cart: CartItem[];
  wishlist: string[];
  cartCount: number;
  addToCart: (item: Omit<CartItem, "key">) => void;
  updateQty: (key: string, qty: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  hydrateKey: number; // increments after localStorage hydration
}

const ShopContext = createContext<ShopContextValue | null>(null);

function readJSON<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function makeKey(item: Omit<CartItem, "key">) {
  return `${item.productId}__${item.colorId ?? ""}__${item.size ?? ""}`;
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrateKey, setHydrateKey] = useState(0);

  // Hydrate from localStorage after mount (SSR-safe).
  useEffect(() => {
    const savedCart = readJSON<CartItem[]>(CART_KEY);
    const savedWish = readJSON<string[]>(WISHLIST_KEY);
    setCart(Array.isArray(savedCart) ? savedCart : []);
    setWishlist(Array.isArray(savedWish) ? savedWish : []);
    setHydrateKey((k) => k + 1);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      /* storage full / private mode — ignore */
    }
  }, [cart]);

  useEffect(() => {
    try {
      window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch {
      /* ignore */
    }
  }, [wishlist]);

  const addToCart = useCallback((item: Omit<CartItem, "key">) => {
    const key = makeKey(item);
    setCart((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, qty: Math.min(i.qty + item.qty, 10) } : i,
        );
      }
      return [...prev, { ...item, key }];
    });
  }, []);

  const updateQty = useCallback((key: string, qty: number) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, qty: Math.min(qty, 10) } : i)),
    );
  }, []);

  const removeFromCart = useCallback((key: string) => {
    setCart((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist],
  );

  const cartCount = useMemo(() => cart.reduce((n, i) => n + i.qty, 0), [cart]);

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      cartCount,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWishlisted,
      hydrateKey,
    }),
    [
      cart,
      wishlist,
      cartCount,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWishlisted,
      hydrateKey,
    ],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
