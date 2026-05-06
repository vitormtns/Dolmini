import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  href,
  actionLabel = "Ver tudo"
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  href?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#00A7A7]">{eyebrow}</p>
        ) : null}
        <h2 className="mt-2 text-3xl font-extrabold leading-[1.02] tracking-tight text-[#003E40] sm:text-5xl">
          {title}
        </h2>
        {subtitle ? <p className="mt-3 text-sm leading-6 text-[#6B7A7C] sm:text-base">{subtitle}</p> : null}
      </div>
      {href ? (
        <Link className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.12em] text-[#003E40] hover:text-[#00A7A7]" href={href}>
          {actionLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
