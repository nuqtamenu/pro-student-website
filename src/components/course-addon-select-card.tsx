"use client";

import { useTranslations } from "next-intl";
import { tx, type Locale } from "@/lib/data";
import { type CourseAddon } from "@/lib/v4-dsa";

type Props = {
  addon: CourseAddon;
  locale: Locale;
  selected: boolean;
  weeks: number;
  onToggle: () => void;
  formatPrice: (value: number) => string;
};

export default function CourseAddonSelectCard({
  addon,
  locale,
  selected,
  weeks,
  onToggle,
  formatPrice,
}: Props) {
  const t = useTranslations("schoolBooking");

  return (
    <label
      className={`flex cursor-pointer items-start justify-between gap-3 rounded-2xl border p-4 transition ${selected ? "border-dark-orange bg-orange-50" : "border-white/40 bg-white/70"}`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          className="mt-1 h-4 w-4 accent-dark-orange"
        />
        <div>
          <h3 className="font-semibold text-gray-dark">
            {tx(addon.addonName, locale)}
          </h3>
          {addon.note ? (
            <p className="mt-1 text-sm text-gray-dark/70">
              {tx(addon.note, locale)}
            </p>
          ) : null}
          {typeof addon.lessons === "number" ? (
            <p className="mt-2 text-sm text-gray-dark/70">
              {t("lessonsPerWeek", { count: addon.lessons })}
            </p>
          ) : null}
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-gray-dark">
          {formatPrice(addon.price * weeks)}
        </p>
      </div>
    </label>
  );
}
