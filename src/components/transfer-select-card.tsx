"use client";

import { useTranslations } from "next-intl";
import { tx, type Locale } from "@/lib/data";
import { type Transfer } from "@/lib/v4-dsa";

type Props = {
  transfer: Transfer;
  locale: Locale;
  selected: boolean;
  amount: number;
  onSelect: () => void;
  formatPrice: (value: number) => string;
};

export default function TransferSelectCard({
  transfer,
  locale,
  selected,
  amount,
  onSelect,
  formatPrice,
}: Props) {
  const t = useTranslations("schoolBooking");
  const pickupLocation = transfer.pickupLocation;
  const tripType = transfer.tripType;

  return (
    <label
      className={`flex cursor-pointer flex-col gap-3 rounded-2xl border p-4 transition ${selected ? "border-dark-orange bg-orange-50" : "border-gray-400/20 bg-white/70"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <input
            type="radio"
            name="transfer"
            checked={selected}
            onChange={onSelect}
            className="mt-1 h-4 w-4 accent-dark-orange"
          />
          <div>
            <h3 className="font-semibold text-gray-dark">
              {tx(transfer.transferName, locale)}
            </h3>
            {transfer.transferDescription ? (
              <p className="mt-1 text-sm text-gray-dark/70">
                {tx(transfer.transferDescription, locale)}
              </p>
            ) : null}
            <div className="mt-2 flex flex-wrap gap-2">
              {pickupLocation ? (
                <span className="rounded-full border border-white/40 bg-white px-2 py-1 text-xs text-gray-dark/70">
                  {t("pickup", { location: tx(pickupLocation, locale) })}
                </span>
              ) : null}
              <span className="rounded-full border border-white/40 bg-white px-2 py-1 text-xs text-gray-dark/70">
                {tripType === "roundTrip" ? t("roundTrip") : t("oneWay")}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-dark">
            {formatPrice(amount)}
          </p>
        </div>
      </div>
    </label>
  );
}
