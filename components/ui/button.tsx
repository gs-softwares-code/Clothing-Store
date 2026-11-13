import { forwardRef, type ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "light" | "dark";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-white hover:bg-accent-deep active:bg-accent-deep disabled:bg-line disabled:text-faint",
  dark: "bg-accent-deep text-white hover:bg-accent disabled:bg-line disabled:text-faint",
  outline:
    "border border-ink/25 text-ink hover:border-ink hover:bg-cream disabled:border-line disabled:text-faint",
  ghost: "text-ink hover:bg-cream disabled:text-faint",
  light: "bg-white text-ink hover:bg-cream disabled:bg-white/70 disabled:text-faint",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-[13px]",
  lg: "h-13 px-8 text-sm",
  icon: "h-10 w-10",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

export interface ButtonProps
  extends BaseProps,
    ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", fullWidth, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium uppercase tracking-[0.12em] transition-[color,background-color,border-color,box-shadow,transform] duration-200 select-none active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";

interface LinkButtonProps extends BaseProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  children,
  ...rest
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium uppercase tracking-[0.12em] transition-[color,background-color,border-color,box-shadow,transform] duration-200 select-none active:scale-[0.98]",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {children}
    </Link>
  );
}
