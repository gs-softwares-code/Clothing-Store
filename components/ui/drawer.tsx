"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { IconX } from "./icon";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  side?: "left" | "right";
  labelledBy?: string;
  className?: string;
}

/**
 * Accessible drawer (dialog) with focus trap, Esc handling, and
 * body scroll lock. Rendered via portal into document.body.
 */
export function Drawer({
  open,
  onClose,
  children,
  side = "right",
  labelledBy,
  className,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const close = useCallback(() => onClose(), [onClose]);

  // Focus + body lock
  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement;
    const panel = panelRef.current;
    if (panel) {
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      (focusables[0] ?? panel).focus();
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && panel) {
        const focusables = Array.from(
          panel.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ),
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus();
    };
  }, [open, close]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close dialog"
        onClick={close}
        className="absolute inset-0 h-full w-full cursor-default bg-ink/40 backdrop-blur-[1px] animate-[fadeIn_180ms_ease]"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={cn(
          "absolute inset-y-0 flex w-full max-w-md flex-col bg-canvas shadow-2xl animate-[slideIn_260ms_cubic-bezier(0.22,1,0.36,1)]",
          side === "right" ? "right-0 rounded-l-md" : "left-0 rounded-r-md",
          className,
        )}
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center text-ink hover:bg-cream"
        >
          <IconX />
        </button>
        {children}
      </div>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(24px); opacity: 0.6; }
          to { transform: translateX(0); opacity: 1; }
        }
        [data-side="left"] { animation-name: slideInLeft; }
        @keyframes slideInLeft {
          from { transform: translateX(-24px); opacity: 0.6; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>,
    document.body,
  );
}

export function DrawerHeader({
  title,
  id,
  sub,
}: {
  title: string;
  id: string;
  sub?: string;
}) {
  return (
    <div className="border-b border-line px-5 pb-4 pt-5">
      <h2 id={id} className="font-display text-lg font-semibold tracking-tight text-ink">
        {title}
      </h2>
      {sub && <p className="mt-0.5 text-xs text-muted">{sub}</p>}
    </div>
  );
}
