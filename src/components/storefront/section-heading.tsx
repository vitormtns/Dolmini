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
    <div className="mb-6 flex flex-col gap-4 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#00A7A7] sm:text-xs sm:tracking-[0.22em]">{eyebrow}</p>
        ) : null}
        <h2 className="mt-2 text-[clamp(1.75rem,8vw,2.35rem)] font-extrabold leading-[1.04] tracking-tight text-[#003E40] sm:text-5xl">
          {title}
        </h2>
        {subtitle ? <p className="mt-3 text-sm leading-6 text-[#6B7A7C] sm:text-base">{subtitle}</p> : null}
      </div>
      {href ? (
        <Link className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-[rgba(0,62,64,0.12)] bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.1em] text-[#003E40] hover:text-[#00A7A7] sm:border-0 sm:bg-transparent sm:px-0 sm:text-sm sm:tracking-[0.12em]" href={href}>
          {actionLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
