import Link from "next/link";
import { cn } from "@/lib/utils";
import { IconArrowRight } from "./icon";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  linkHref?: string;
  linkLabel?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  linkHref,
  linkLabel = "View all",
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-8 md:mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className,
      )}
    >
      <div className={cn("max-w-xl", align === "center" && "flex flex-col items-center")}>
        {eyebrow && (
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
        )}
      </div>
      {linkHref && (
        <Link
          href={linkHref}
          className="group inline-flex shrink-0 items-center gap-2 border-b border-ink/20 pb-1 text-xs font-medium uppercase tracking-[0.16em] text-ink transition-colors hover:border-ink"
        >
          {linkLabel}
          <IconArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
