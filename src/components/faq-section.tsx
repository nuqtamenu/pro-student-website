"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";

type FaqItem = { q: string; a: string };

export function FaqSection() {
  const t = useTranslations("faq");
  const items = t.raw("items") as FaqItem[];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white py-14 sm:py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-dark-orange">
            {t("label")}
          </span>
          <h2 className="mt-2 text-2xl font-extrabold text-gray-dark sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-light">
            {t("description")}
          </p>
          <button
            type="button"
            className="mt-6 rounded-lg bg-dark-orange px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-red"
          >
            {t("contactButton")}
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-black/10 bg-white"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start"
                >
                  <span className="text-sm font-semibold text-gray-dark">
                    {item.q}
                  </span>
                  <Icon
                    icon="lucide:chevron-down"
                    width={20}
                    className={`shrink-0 text-dark-orange transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="px-5 pb-5 text-sm leading-relaxed text-gray-light">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
