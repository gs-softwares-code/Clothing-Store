import type { ReactNode } from "react";
import { Container } from "./ui/container";
import { Breadcrumbs } from "./breadcrumbs";

export function InfoPage({
  crumb,
  title,
  lede,
  children,
}: {
  crumb: string;
  title: string;
  lede?: string;
  children: ReactNode;
}) {
  return (
    <section className="py-8 md:py-14">
      <Container className="max-w-4xl">
        <Breadcrumbs items={[{ label: crumb }]} />
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
          {title}
        </h1>
        {lede && <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">{lede}</p>}
        <div className="mt-8 space-y-8">{children}</div>
      </Container>
    </section>
  );
}

export function InfoSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">{children}</div>
    </section>
  );
}

export function InfoNote({ children }: { children: ReactNode }) {
  return (
    <div className="border-l-2 border-accent bg-accent-tint px-4 py-3 text-sm text-accent-deep">
      {children}
    </div>
  );
}
