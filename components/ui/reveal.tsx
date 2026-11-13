"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant =
  | "fade-up"
  | "fade-down"
  | "fade-in"
  | "scale-in"
  | "slide-left"
  | "slide-right";

const hiddenStyles: Record<Variant, string> = {
  "fade-up": "opacity-0 translate-y-7",
  "fade-down": "opacity-0 -translate-y-7",
  "fade-in": "opacity-0",
  "scale-in": "opacity-0 scale-[0.96]",
  "slide-left": "opacity-0 -translate-x-10",
  "slide-right": "opacity-0 translate-x-10",
};

interface RevealProps {
  children: ReactNode;
  /** Entrance motion. Defaults to a soft rise. */
  variant?: Variant;
  /** Transition delay in ms — use for staggered groups. */
  delay?: number;
  /** Transition duration in ms. */
  duration?: number;
  /** Only animate once (default) or replay every time it re-enters the viewport. */
  once?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * Scroll-reveal wrapper. Content fades/slides in the first time it enters the
 * viewport. Respects `prefers-reduced-motion` and never animates twice by default.
 * SSR-safe: hidden and visible states render identical HTML, so there is no
 * hydration mismatch.
 */
export function Reveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 700,
  once = true,
  className,
  style,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms`, transitionDuration: `${duration}ms`, ...style }}
      className={cn(
        "will-change-[opacity,transform] transition-[opacity,transform] ease-out",
        !visible && cn("reveal-hidden", hiddenStyles[variant]),
        className,
      )}
    >
      {children}
    </div>
  );
}
