"use client";

import { useState } from "react";
import Link from "next/link";
import { Drawer, DrawerHeader } from "./ui/drawer";
import { IconChevronDown } from "./ui/icon";
import { NAV_ITEMS, UTILITY_LINKS, subcatHref } from "@/lib/domain/navigation";
import { COLLECTIONS } from "@/lib/domain/categories";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Drawer open={open} onClose={onClose} side="left">
      <DrawerHeader id="mobile-nav-title" title="Menu" />
      <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto px-5 py-4">
        <ul className="divide-y divide-line">
          {NAV_ITEMS.map((item) => {
            const isOpen = expanded === item.key;
            const hasChildren = Boolean(item.columns?.length);
            const showCollections = item.key === "collections";
            return (
              <li key={item.key}>
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex-1 py-3.5 text-[15px] font-medium text-ink"
                  >
                    {item.label}
                  </Link>
                  {hasChildren && (
                    <button
                      aria-expanded={isOpen}
                      aria-label={`${isOpen ? "Collapse" : "Expand"} ${item.label}`}
                      onClick={() => setExpanded(isOpen ? null : item.key)}
                      className="flex h-11 w-11 items-center justify-center text-muted"
                    >
                      <IconChevronDown
                        size={18}
                        className={cn("transition-transform duration-200", isOpen && "rotate-180")}
                      />
                    </button>
                  )}
                </div>
                {hasChildren && isOpen && (
                  <ul className="pb-3 pl-2">
                    {item.columns![0].map((sub) => (
                      <li key={sub.id}>
                        <Link
                          href={showCollections ? `/collections/${sub.id}` : subcatHref(item.key, sub.id)}
                          onClick={onClose}
                          className="block py-2 text-sm text-muted"
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                    {item.columns![1] && (
                      <li>
                        <Link
                          href={showCollections ? `/collections/${COLLECTIONS[1].id}` : subcatHref(item.key, item.columns![1][0].id)}
                          onClick={onClose}
                          className="block py-2 text-sm text-muted"
                        >
                          {item.columns![1][0].label}
                        </Link>
                      </li>
                    )}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        <ul className="mt-6 space-y-3 border-t border-line pt-5">
          {UTILITY_LINKS.map((l) => (
            <li key={l.label}>
              <Link href={l.href} onClick={onClose} className="text-sm text-muted">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Drawer>
  );
}
