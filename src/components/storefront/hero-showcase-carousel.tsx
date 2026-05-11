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
      <div className="absolute bottom-8 right-4 w-[66%] max-w-xl rounded-[1.1rem] border border-white/18 bg-white/10 p-5 text-white shadow-lift backdrop-blur sm:bottom-10 sm:right-10 sm:rounded-[1.5rem] sm:p-7">
        <p className="text-4xl font-extrabold tracking-tight sm:text-7xl">Dolmini</p>
        <p className="mt-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[#00C2C7] sm:tracking-[0.26em]">{label}</p>
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
      <div className="relative min-h-[470px] overflow-hidden bg-[#002D2F] shadow-[0_34px_120px_rgba(0,45,47,0.22)] sm:aspect-[12/5] sm:min-h-[520px] lg:min-h-[640px]">
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

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,244,239,0.94)_0%,rgba(248,244,239,0.8)_42%,rgba(248,244,239,0.26)_72%,rgba(0,45,47,0.34)_100%)] sm:bg-[linear-gradient(90deg,rgba(248,244,239,0.96)_0%,rgba(248,244,239,0.9)_28%,rgba(248,244,239,0.55)_42%,rgba(248,244,239,0)_58%)]" />
            <div className="absolute inset-y-0 left-0 hidden w-[58%] bg-[repeating-linear-gradient(135deg,rgba(0,62,64,0.045)_0_1px,transparent_1px_30px)] sm:block" />

            <div className="relative z-20 mx-auto flex min-h-[470px] max-w-[1500px] flex-col justify-center px-4 pb-16 pt-9 sm:min-h-[520px] sm:px-8 sm:py-10 lg:min-h-[640px] lg:px-12 xl:px-16">
              <div className="max-w-[740px]">
                <span className="inline-flex rounded-full border border-[rgba(0,62,64,0.14)] bg-white/84 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#003E40] shadow-soft backdrop-blur sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.18em]">
                  {slide.eyebrow}
                </span>
                <h1 className="mt-4 max-w-[min(19.5rem,calc(100vw-2rem))] break-words text-[clamp(1.9rem,8.6vw,2.6rem)] font-extrabold leading-[1] tracking-tight text-[#003E40] sm:mt-6 sm:max-w-3xl sm:text-6xl lg:text-8xl">
                  {slide.title}
                </h1>
                <p className="mt-4 max-w-[min(21rem,calc(100vw-2rem))] text-sm leading-6 text-[#536A6D] sm:mt-5 sm:max-w-[34rem] sm:text-lg sm:leading-7">
                  {slide.description}
                </p>
                <div className="mt-6 grid max-w-[18.5rem] grid-cols-1 gap-2.5 sm:mt-8 sm:flex sm:max-w-none sm:flex-wrap sm:gap-3">
                  <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#003E40] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.1em] text-white shadow-lift transition hover:bg-[#002D2F] sm:px-6 sm:text-sm sm:tracking-[0.12em]" href={slide.href}>
                    {slide.ctaLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(0,62,64,0.16)] bg-white/88 px-5 py-3 text-xs font-extrabold uppercase tracking-[0.1em] text-[#003E40] transition hover:bg-white sm:px-6 sm:text-sm sm:tracking-[0.12em]" href={slide.secondaryHref}>
                    {slide.secondaryLabel}
                  </Link>
                </div>
              </div>

              <div className="mt-6 flex max-w-xl flex-wrap gap-2 sm:mt-10 sm:gap-3">
                <span className="rounded-xl border border-[rgba(0,62,64,0.12)] bg-white/82 px-3 py-2 text-xs font-extrabold text-[#003E40] shadow-soft backdrop-blur sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm">
                  {slide.detailLabel ?? "Dolmini Model"}
                </span>
                {slide.badge ? (
                  <span className="rounded-xl bg-[#00C2C7] px-3 py-2 text-xs font-extrabold text-[#003E40] shadow-soft sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm">
                    {slide.badge}
                  </span>
                ) : null}
                {slide.priceLabel ? (
                  <span className="hidden rounded-2xl bg-[#003E40] px-4 py-3 text-sm font-extrabold text-white shadow-soft sm:inline-flex">
                    {slide.priceLabel}
                  </span>
                ) : null}
              </div>
            </div>
          </article>
        ))}

        <div className="absolute bottom-5 left-1/2 z-30 flex w-full max-w-[1500px] -translate-x-1/2 items-center justify-between gap-4 px-4 sm:bottom-7 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex gap-2">
            {safeSlides.map((slide, index) => (
              <button
                aria-label={`Ir para o slide ${index + 1}: ${slide.eyebrow}`}
                className={cn(
                  "h-2 rounded-full transition-all",
                  active === index ? "w-8 bg-[#00C2C7] sm:w-10" : "w-2 bg-[#003E40]/35 hover:bg-[#003E40]"
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
