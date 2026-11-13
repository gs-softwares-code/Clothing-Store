import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]",
        className,
      )}
      {...props}
    />
  );
}

export function SaleBadge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <Badge className={cn("bg-sale text-white", className)} {...props} />
  );
}

export function NewBadge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <Badge className={cn("bg-ink text-white", className)} {...props} />
  );
}
