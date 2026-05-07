"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type HeroShowcaseSlide = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  imageUrl?: string | null;
  imageAlt: string;
  priceLabel?: string | null;
  badge?: string;
  detailLabel?: string;
};

function HeroFallbackVisual({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#002D2F]">
      <div className="absolute inset-0 bg-[linear-gradient(115deg,#F8F4EF_0%,#EFE7DC_34%,transparent_34%),linear-gradient(135deg,#003E40_0%,#002D2F_100%)]" />
      <div className="absolute -right-12 top-10 h-[78%] w-[58%] skew-x-[-14deg] bg-[#00C2C7]/24" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_26px)]" />
      <div className="absolute bottom-10 right-6 w-[58%] max-w-xl rounded-[1.5rem] border border-white/18 bg-white/10 p-7 text-white shadow-lift backdrop-blur sm:right-10">
        <p className="text-5xl font-extrabold tracking-tight sm:text-7xl">Dolmini</p>
        <p className="mt-3 text-xs font-extrabold uppercase tracking-[0.26em] text-[#00C2C7]">{label}</p>
      </div>
    </div>
  );
}

export function HeroShowcaseCarousel({ slides }: { slides: HeroShowcaseSlide[] }) {
  const safeSlides = useMemo(
    () =>
      slides.length
        ? slides
        : [
            {
              eyebrow: "Nova coleção",
              title: "Peças que acompanham seu ritmo",
              description: "Jeans, bermudas e moda casual selecionada para vestir o dia com leveza, presença e praticidade.",
              href: "/produtos",
              ctaLabel: "Ver coleção",
              secondaryHref: "/produtos",
              secondaryLabel: "Comprar agora",
              imageAlt: "Dolmini Model",
              detailLabel: "Nova coleção"
            }
          ],
    [slides]
  );
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  function goTo(index: number) {
    setActive((index + safeSlides.length) % safeSlides.length);
  }

  function next() {
    goTo(active + 1);
  }

  function previous() {
    goTo(active - 1);
  }

  useEffect(() => {
    if (paused || safeSlides.length <= 1) return;
    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % safeSlides.length);
    }, 5600);
    return () => window.clearInterval(interval);
  }, [paused, safeSlides.length]);

  return (
    <section
      aria-label="Campanhas principais"
      className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
        setPaused(true);
      }}
      onTouchEnd={(event) => {
        const start = touchStartX.current;
        const end = event.changedTouches[0]?.clientX ?? null;
        touchStartX.current = null;
        if (start == null || end == null) return;
        const distance = start - end;
        if (Math.abs(distance) > 42) {
          if (distance > 0) next();
          else previous();
        }
        window.setTimeout(() => setPaused(false), 900);
      }}
    >
      <div className="relative min-h-[560px] overflow-hidden bg-[#002D2F] shadow-[0_34px_120px_rgba(0,45,47,0.22)] sm:aspect-[12/5] sm:min-h-[520px] lg:min-h-[640px]">
        {safeSlides.map((slide, index) => (
          <article
            aria-hidden={active !== index}
            className={cn(
              "absolute inset-0 transition duration-700 ease-out",
              active === index ? "z-10 scale-100 opacity-100" : "z-0 scale-[1.015] opacity-0"
            )}
            key={`${slide.eyebrow}-${slide.title}`}
          >
            {slide.imageUrl ? (
              <Image
                alt={slide.imageAlt}
                className="h-full w-full object-cover object-center"
                fill
                priority={index === 0}
                sizes="100vw"
                src={slide.imageUrl}
              />
            ) : (
              <HeroFallbackVisual label={slide.detailLabel ?? slide.eyebrow} />
            )}

            <div className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(90deg,rgba(248,244,239,0.96)_0%,rgba(248,244,239,0.9)_28%,rgba(248,244,239,0.55)_42%,rgba(248,244,239,0)_58%)]" />
            <div className="absolute inset-y-0 left-0 w-[58%] bg-[repeating-linear-gradient(135deg,rgba(0,62,64,0.045)_0_1px,transparent_1px_30px)]" />

            <div className="relative z-20 mx-auto flex min-h-[560px] max-w-[1500px] flex-col justify-center px-5 py-10 sm:min-h-[520px] sm:px-8 lg:min-h-[640px] lg:px-12 xl:px-16">
              <div className="max-w-[740px]">
                <span className="inline-flex rounded-full border border-[rgba(0,62,64,0.14)] bg-white/84 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#003E40] shadow-soft backdrop-blur">
                  {slide.eyebrow}
                </span>
                <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[0.95] tracking-tight text-[#003E40] sm:text-6xl lg:text-8xl">
                  {slide.title}
                </h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-[#536A6D] sm:text-lg">
                  {slide.description}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#003E40] px-6 py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-white shadow-lift transition hover:bg-[#002D2F]" href={slide.href}>
                    {slide.ctaLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link className="inline-flex min-h-12 items-center rounded-full border border-[rgba(0,62,64,0.16)] bg-white/88 px-6 py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-[#003E40] transition hover:bg-white" href={slide.secondaryHref}>
                    {slide.secondaryLabel}
                  </Link>
                </div>
              </div>

              <div className="mt-10 flex max-w-xl flex-wrap gap-3">
                <span className="rounded-2xl border border-[rgba(0,62,64,0.12)] bg-white/82 px-4 py-3 text-sm font-extrabold text-[#003E40] shadow-soft backdrop-blur">
                  {slide.detailLabel ?? "Dolmini Model"}
                </span>
                {slide.priceLabel ? (
                  <span className="rounded-2xl bg-[#003E40] px-4 py-3 text-sm font-extrabold text-white shadow-soft">
                    {slide.priceLabel}
                  </span>
                ) : null}
                {slide.badge ? (
                  <span className="rounded-2xl bg-[#00C2C7] px-4 py-3 text-sm font-extrabold text-[#003E40] shadow-soft">
                    {slide.badge}
                  </span>
                ) : null}
              </div>
            </div>
          </article>
        ))}

        <div className="absolute bottom-5 left-1/2 z-30 flex w-full max-w-[1500px] -translate-x-1/2 items-center justify-between gap-4 px-5 sm:bottom-7 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex gap-2">
            {safeSlides.map((slide, index) => (
              <button
                aria-label={`Ir para o slide ${index + 1}: ${slide.eyebrow}`}
                className={cn(
                  "h-2 rounded-full transition-all",
                  active === index ? "w-10 bg-[#00C2C7]" : "w-2 bg-[#003E40]/35 hover:bg-[#003E40]"
                )}
                key={`${slide.eyebrow}-dot`}
                onClick={() => {
                  setPaused(true);
                  goTo(index);
                }}
                type="button"
              />
            ))}
          </div>
          {safeSlides.length > 1 ? (
            <div className="hidden gap-2 sm:flex">
              <button
                aria-label="Slide anterior"
                className="grid h-11 w-11 place-items-center rounded-full border border-white/28 bg-white/20 text-white backdrop-blur transition hover:bg-white hover:text-[#003E40]"
                onClick={() => {
                  setPaused(true);
                  previous();
                }}
                type="button"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                aria-label="Próximo slide"
                className="grid h-11 w-11 place-items-center rounded-full border border-white/28 bg-white/20 text-white backdrop-blur transition hover:bg-white hover:text-[#003E40]"
                onClick={() => {
                  setPaused(true);
                  next();
                }}
                type="button"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
