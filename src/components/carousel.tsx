"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Icon } from "@iconify/react";

type CarouselProps = {
  children: React.ReactNode[];
  /** Tailwind classes controlling slide width per breakpoint. */
  slideClassName?: string;
  showArrows?: boolean;
  className?: string;
  align?: "start" | "center";
};

export function Carousel({
  children,
  slideClassName = "basis-full sm:basis-1/2 lg:basis-1/4",
  showArrows = false,
  className = "",
  align = "start",
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align,
    loop: false,
    direction:
      typeof document !== "undefined" &&
      document.documentElement.dir === "rtl"
        ? "rtl"
        : "ltr",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback((api: NonNullable<typeof emblaApi>) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className={`relative ${className}`}>
      {showArrows && (
        <button
          type="button"
          aria-label="Previous"
          onClick={scrollPrev}
          className="absolute start-0 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-dark shadow-md transition hover:bg-light-orange hover:text-white"
        >
          <Icon icon="lucide:chevron-left" className="rtl:rotate-180" width={22} />
        </button>
      )}

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-5">
          {children.map((child, i) => (
            <div key={i} className={`min-w-0 shrink-0 grow-0 ${slideClassName}`}>
              {child}
            </div>
          ))}
        </div>
      </div>

      {showArrows && (
        <button
          type="button"
          aria-label="Next"
          onClick={scrollNext}
          className="absolute end-0 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-dark shadow-md transition hover:bg-light-orange hover:text-white"
        >
          <Icon icon="lucide:chevron-right" className="rtl:rotate-180" width={22} />
        </button>
      )}

      <div className="mt-7 flex items-center justify-center gap-2">
        {scrollSnaps.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => scrollTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === selectedIndex
                ? "w-6 bg-dark-orange"
                : "w-2 bg-light-orange/50 hover:bg-light-orange"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
