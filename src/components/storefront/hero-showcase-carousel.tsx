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
  imageUrl?: string | null;
  imageAlt: string;
  priceLabel?: string | null;
  badge?: string;
};

function HeroFallbackVisual({ label }: { label: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#003E40] p-6 text-center text-white">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,194,199,0.28)_0%,transparent_34%),linear-gradient(115deg,#003E40_0%,#002D2F_48%,#EFE7DC_48%,#F8F4EF_100%)]" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_24px)]" />
      <div className="relative">
        <p className="text-4xl font-extrabold tracking-tight text-white">Dolmini</p>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.22em] text-[#00C2C7]">{label}</p>
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
              title: "Curadoria Dolmini",
              description: "Peças selecionadas para vestir o dia com leveza.",
              href: "/produtos",
              ctaLabel: "Ver coleção",
              imageAlt: "Dolmini Model"
            }
          ],
    [slides]
  );
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const activeSlide = safeSlides[active] ?? safeSlides[0];

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
    }, 5200);
    return () => window.clearInterval(interval);
  }, [paused, safeSlides.length]);

  return (
    <div
      className="relative"
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
      <div className="relative min-h-[430px] overflow-hidden rounded-[1.7rem] border border-white/70 bg-[#003E40] shadow-[0_34px_120px_rgba(0,45,47,0.34)] sm:min-h-[560px] lg:min-h-[610px]">
        {safeSlides.map((slide, index) => (
          <Link
            aria-hidden={active !== index}
            className={cn(
              "absolute inset-0 block transition duration-700 ease-out",
              active === index ? "z-10 translate-x-0 opacity-100" : "z-0 translate-x-4 opacity-0"
            )}
            href={slide.href}
            key={`${slide.eyebrow}-${slide.title}`}
            tabIndex={active === index ? 0 : -1}
          >
            <div className="absolute inset-0">
              {slide.imageUrl ? (
                <Image
                  alt={slide.imageAlt}
                  className="h-full w-full object-cover"
                  fill
                  priority={index === 0}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  src={slide.imageUrl}
                />
              ) : (
                <HeroFallbackVisual label={slide.eyebrow} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#002D2F]/92 via-[#003E40]/38 to-transparent" />
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/18 to-transparent" />
            </div>

            <div className="relative flex min-h-[430px] flex-col justify-end p-5 text-white sm:min-h-[560px] sm:p-7 lg:min-h-[610px]">
              <div className="mb-auto flex items-start justify-between gap-4">
                <span className="rounded-full border border-white/18 bg-white/16 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white backdrop-blur">
                  {slide.eyebrow}
                </span>
                {slide.badge ? (
                  <span className="rounded-full bg-[#00C2C7] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#003E40] shadow-soft">
                    {slide.badge}
                  </span>
                ) : null}
              </div>

              <div className="max-w-md">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#00C2C7]">Produto em foco</p>
                <h2 className="mt-3 text-3xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl">
                  {slide.title}
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-6 text-white/78">{slide.description}</p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {slide.priceLabel ? (
                    <strong className="rounded-full bg-white px-4 py-2 text-sm font-extrabold text-[#003E40]">
                      {slide.priceLabel}
                    </strong>
                  ) : null}
                  <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-white backdrop-blur">
                    {slide.ctaLabel}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}

        <div className="pointer-events-none absolute inset-4 z-20 rounded-[1.2rem] border border-white/14" />
        <div className="absolute bottom-5 left-5 right-5 z-30 flex items-center justify-between gap-4">
          <div className="flex gap-2">
            {safeSlides.map((slide, index) => (
              <button
                aria-label={`Ir para o slide ${index + 1}: ${slide.eyebrow}`}
                className={cn(
                  "h-2 rounded-full transition-all",
                  active === index ? "w-8 bg-[#00C2C7]" : "w-2 bg-white/55 hover:bg-white"
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
                className="grid h-10 w-10 place-items-center rounded-full border border-white/18 bg-white/14 text-white backdrop-blur transition hover:bg-white hover:text-[#003E40]"
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
                className="grid h-10 w-10 place-items-center rounded-full border border-white/18 bg-white/14 text-white backdrop-blur transition hover:bg-white hover:text-[#003E40]"
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

      <div className="absolute -bottom-4 -left-3 z-20 hidden rounded-2xl border border-[rgba(0,62,64,0.12)] bg-white p-4 shadow-lift md:block">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#00A7A7]">Vitrine ativa</p>
        <p className="mt-1 max-w-[190px] text-sm font-extrabold leading-5 text-[#003E40]">{activeSlide.title}</p>
      </div>
    </div>
  );
}
