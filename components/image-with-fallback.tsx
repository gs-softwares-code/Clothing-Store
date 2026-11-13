"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

/**
 * Image that falls back to a neutral FORME placeholder rather than
 * showing a broken-image icon. Used for every product image.
 */
export function ImageWithFallback({ className, alt, ...props }: ImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex items-center justify-center bg-cream text-faint",
          className,
        )}
      >
        <span className="font-display text-sm font-semibold tracking-[0.3em] uppercase">
          FORME
        </span>
      </div>
    );
  }

  return (
    <Image
      className={className}
      alt={alt}
      {...props}
      onError={() => setError(true)}
    />
  );
}
