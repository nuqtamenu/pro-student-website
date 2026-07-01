"use client";

import { useTranslations } from "next-intl";
import { tx, type Locale } from "@/lib/data";
import { type Accommodation } from "@/lib/v4-dsa";

type Props = {
  accommodation: Accommodation;
  locale: Locale;
  selected: boolean;
  price: number;
  weeks: number;
  onSelect: () => void;
  formatPrice: (value: number) => string;
};

export default function AccommodationSelectCard({
  accommodation,
  locale,
  selected,
  price,
  weeks,
  onSelect,
  formatPrice,
}: Props) {
  const t = useTranslations("schoolBooking");

  return (
    <label
      className={`flex cursor-pointer flex-col gap-3 rounded-2xl border p-4 transition ${selected ? "border-dark-orange bg-orange-50" : "border-gray-500/20 bg-white/70"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <input
            type="radio"
            name="accommodation"
            checked={selected}
            onChange={onSelect}
            className="mt-1 h-4 w-4 accent-dark-orange"
          />
          <div>
            <h3 className="font-semibold text-gray-dark">
              {tx(accommodation.accommodationName, locale)}
            </h3>
            {accommodation.accommodationDescription ? (
              <p className="mt-1 text-sm text-gray-dark/70">
                {tx(accommodation.accommodationDescription, locale)}
              </p>
            ) : null}
            <div className="mt-2 flex flex-wrap gap-2">
              {typeof accommodation.minimumAge === "number" ? (
                <span className="rounded-full border border-white/40 bg-white px-2 py-1 text-xs text-gray-dark/70">
                  {t("minAge", { age: accommodation.minimumAge })}
                </span>
              ) : null}
              <span className="rounded-full border border-white/40 bg-white px-2 py-1 text-xs text-gray-dark/70">
                {t(`frequency.${accommodation.priceFrequency ?? "weekly"}`)}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-dark">
            {formatPrice(price)}
          </p>
          <p className="text-xs text-gray-dark/60">
            {t("forWeeks", { count: weeks })}
          </p>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-white/40 bg-white/70 p-3">
        {accommodation.location && accommodation.location.length > 0 ? (
          <div>
            <p className="text-sm font-semibold text-gray-dark">
              {t("location")}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {accommodation.location.map((location, locationIndex) => (
                <span
                  key={`${accommodation.id}-location-${locationIndex}`}
                  className="rounded-full border border-white/40 bg-orange-50 px-2 py-1 text-xs text-gray-dark"
                >
                  {location.name?.[locale] ?? location.name?.en}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {accommodation.commuteOptions &&
        accommodation.commuteOptions.length > 0 ? (
          <div>
            <p className="text-sm font-semibold text-gray-dark">
              {t("commute")}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {accommodation.commuteOptions.map((option, optionIndex) => (
                <span
                  key={`${accommodation.id}-commute-${optionIndex}`}
                  className="rounded-full border border-white/40 bg-white px-2 py-1 text-xs text-gray-dark"
                >
                  {option.transport?.mode?.[locale] ??
                    option.transport?.mode?.en}{" "}
                  · {option.travelTime.min}-{option.travelTime.max}{" "}
                  {option.travelTime.unit}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {accommodation.note ? (
          <p className="text-sm text-gray-dark/70">
            {tx(accommodation.note, locale)}
          </p>
        ) : null}
      </div>
    </label>
  );
}
