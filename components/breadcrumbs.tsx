import Link from "next/link";
import { IconChevronRight } from "./ui/icon";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
        <li>
          <Link href="/" className="transition-colors hover:text-ink">
            Home
          </Link>
        </li>
        {items.map((c, i) => (
          <li key={c.label} className="flex items-center gap-1.5">
            <IconChevronRight size={12} className="text-faint" />
            {c.href && i < items.length - 1 ? (
              <Link href={c.href} className="transition-colors hover:text-ink">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
