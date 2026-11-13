"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createPortal } from "react-dom";
import { searchProducts } from "@/lib/data/catalog";
import { CATEGORIES } from "@/lib/domain/categories";
import { formatINR } from "@/lib/utils";
import { ImageWithFallback } from "./image-with-fallback";
import { IconArrowRight, IconSearch, IconX } from "./ui/icon";

const POPULAR = ["cotton tee", "trousers", "denim", "coat", "hoodie", "dress"];

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      const t = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => (query.trim() ? searchProducts(query) : []), [query]);

  if (!open) return null;

  const submit = () => {
    if (!query.trim()) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return createPortal(
    <div className="fixed inset-0 z-[60]">
      <button aria-label="Close search" onClick={onClose} className="absolute inset-0 h-full w-full bg-ink/40 backdrop-blur-[1px]" />
      <div className="relative mx-auto mt-20 w-full max-w-3xl rounded-md bg-canvas p-5 shadow-2xl md:p-8 animate-[fadeIn_180ms_ease]">
        <div className="flex items-center gap-3 border-b border-line pb-4">
          <IconSearch className="shrink-0 text-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Search products, categories, materials…"
            aria-label="Search products"
            className="w-full bg-transparent text-lg text-ink placeholder:text-faint focus:outline-none"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="flex h-9 w-9 shrink-0 items-center justify-center text-muted hover:bg-cream"
          >
            <IconX size={18} />
          </button>
        </div>

        {!query.trim() ? (
          <div className="grid gap-8 pt-5 md:grid-cols-2">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                Suggested categories
              </p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.id}
                    href={`/${c.id}`}
                    onClick={onClose}
                    className="border border-line px-3 py-1.5 text-xs text-ink hover:border-ink"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                Popular searches
              </p>
              <ul className="space-y-1">
                {POPULAR.map((term) => (
                  <li key={term}>
                    <button
                      onClick={() => {
                        setQuery(term);
                        inputRef.current?.focus();
                      }}
                      className="text-sm text-ink/80 hover:text-accent"
                    >
                      {term}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="py-10 text-center">
            <p className="font-display text-lg font-semibold text-ink">No results for “{query}”</p>
            <p className="mt-1 text-sm text-muted">
              Try a different term, or browse by category.
            </p>
          </div>
        ) : (
          <>
            <p className="pt-4 text-xs text-muted">{results.length} result{results.length === 1 ? "" : "s"}</p>
            <ul className="mt-2 max-h-[46vh] divide-y divide-line overflow-y-auto">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/product/${p.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 py-3 hover:bg-cream"
                  >
                    <div className="h-16 w-12 shrink-0 overflow-hidden bg-cream">
                      <ImageWithFallback
                        src={p.images[0]}
                        alt={p.name}
                        width={96}
                        height={128}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-ink">{p.name}</p>
                      <p className="text-xs capitalize text-muted">
                        {p.category} · {p.subcategory.replace("-", " ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-ink">{formatINR(p.discountPrice ?? p.price)}</p>
                      {p.discountPrice && (
                        <p className="text-xs text-faint line-through">{formatINR(p.price)}</p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <button
              onClick={submit}
              className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent"
            >
              See all results
              <IconArrowRight size={14} />
            </button>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
