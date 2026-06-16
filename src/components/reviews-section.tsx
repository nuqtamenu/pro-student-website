"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";
import { Carousel } from "./carousel";

type Review = { name: string; time: string; text: string };

export function ReviewsSection() {
  const t = useTranslations("reviews");
  const items = t.raw("items") as Review[];

  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="mb-8 text-center text-2xl font-extrabold text-gray-dark sm:text-3xl">
          {t("title")}
        </h2>
        <div className="">
          <Carousel
            showArrows
            align="center"
            slideClassName="basis-full md:basis-1/2 lg:basis-1/3"
          >
            {items.map((review, i) => (
              <article
                key={i}
                className="flex h-full flex-col rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-light-orange/30 text-sm font-bold text-dark-orange">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-dark">
                      {review.name}
                    </p>
                    <p className="text-xs text-gray-light">{review.time}</p>
                  </div>
                  <Icon
                    icon="logos:google-icon"
                    width={18}
                    className="ms-auto"
                  />
                </div>
                <div className="mt-3 flex">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Icon
                      key={s}
                      icon="material-symbols:star-rounded"
                      width={18}
                      className="text-light-orange"
                    />
                  ))}
                </div>
                <p className="mt-3 line-clamp-5 text-sm leading-relaxed text-gray-light">
                  {review.text}
                </p>
              </article>
            ))}
          </Carousel>
        </div>
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className="rounded-lg bg-light-orange px-6 py-3 text-sm font-bold text-gray-dark shadow-md transition hover:bg-dark-orange hover:text-white"
          >
            {t("rateButton")}
          </button>
        </div>
      </div>
    </section>
  );
}
