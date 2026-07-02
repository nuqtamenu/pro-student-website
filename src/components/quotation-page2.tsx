"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { tx, type Locale } from "@/lib/data";
import {
  type Accommodation,
  type AccommodationAddon,
  type Course,
  type CourseAddon,
  type School,
  type Transfer,
} from "@/lib/v4-dsa";
import { getCityById, getCountryById } from "@/lib/search-data";

type Props = {
  school: School;
  course?: Course;
  accommodation?: Accommodation;
  transfer?: Transfer;
  courseAddons?: CourseAddon[];
  accommodationAddons?: AccommodationAddon[];
  courseAddonsPrice?: number;
  accommodationAddonsPrice?: number;
  locale: Locale;
  initial: {
    weeks: number;
    residenceWeeks: number;
    startDate?: string;
    accommodationStartDate?: string;
    accommodationEndDate?: string;
    hasAccommodation: boolean;
    hasAirport: boolean;
    hasInsurance: boolean;
  };
  fees: School["fees"];
  coursePrice: number;
  accommodationPrice: number;
  transferPrice: number;
  insurancePrice: number;
  fixedFeesTotal: number;
  subtotal: number;
  pageTitle?: string;
  showPrintButton?: boolean;
};

function formatPrice(value: number) {
  return `£${value.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })}`;
}

function formatDateLabel(value: string | undefined, locale: Locale) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function normalizeImageSrc(src: string | undefined) {
  if (!src) return "/logo.png";
  if (
    src.startsWith("/") ||
    src.startsWith("http://") ||
    src.startsWith("https://")
  ) {
    return src;
  }
  return `/${src}`;
}

export default function QuotationPage2({
  school,
  course,
  accommodation,
  transfer,
  locale,
  initial,
  fees,
  coursePrice,
  accommodationPrice,
  transferPrice,
  insurancePrice,
  fixedFeesTotal,
  subtotal,
  pageTitle,
  showPrintButton = true,
  courseAddons = [],
  accommodationAddons = [],
}: Props) {
  const t = useTranslations("schoolBooking");
  const country = getCountryById(school.countryId);
  const city = getCityById(school.cityId);

  const courseEnd = useMemo(() => {
    if (!initial.startDate) return undefined;
    const date = new Date(initial.startDate);
    if (Number.isNaN(date.getTime())) return undefined;
    date.setDate(date.getDate() + initial.weeks * 7);
    return date.toISOString().slice(0, 10);
  }, [initial.startDate, initial.weeks]);

  const [printUrl, setPrintUrl] = useState(
    `/api/quotation/print?locale=${locale}`,
  );

  const quoteItems = useMemo(() => {
    const items: Array<{ title: string; detail: string; amount: number }> = [];

    if (course) {
      const courseDetails = [
        ...(course.courseDescription
          ? [tx(course.courseDescription, locale)]
          : []),
        ...(course.courseIntensity
          ? [`${t("courseIntensity")} : ${tx(course.courseIntensity, locale)}`]
          : []),
        ...(course.requiredLevel
          ? [`${t("requiredLevel")} : ${tx(course.requiredLevel, locale)}`]
          : []),
        ...(course.coursePlans?.[0]?.lessonsPerWeek
          ? [
              t("lessonsPerWeek", {
                count: course.coursePlans[0].lessonsPerWeek,
              }),
            ]
          : []),
      ].filter(Boolean);

      items.push({
        title: t("course"),
        detail: courseDetails.join(" • "),
        amount: coursePrice,
      });
    }

    courseAddons.forEach((addon) => {
      const addonDetails = [
        ...(typeof addon.lessons === "number"
          ? [t("lessonsPerWeek", { count: addon.lessons })]
          : []),
        ...(addon.note ? [tx(addon.note, locale)] : []),
      ].filter(Boolean);

      items.push({
        title: tx(addon.addonName, locale),
        detail: addonDetails.join(" • "),
        amount: addon.price * initial.weeks,
      });
    });

    if (initial.hasAccommodation && accommodation) {
      const accommodationDetails = [
        ...(accommodation.accommodationDescription
          ? [tx(accommodation.accommodationDescription, locale)]
          : []),
        ...(accommodation.location?.length
          ? [
              `${t("location")} : ${accommodation.location
                .map((entry) => tx(entry.name, locale))
                .join(", ")}`,
            ]
          : []),
        ...(accommodation.minimumAge
          ? [`${t("minAge", { age: accommodation.minimumAge })}`]
          : []),
      ].filter(Boolean);

      items.push({
        title: t("accommodation"),
        detail: `${tx(accommodation.accommodationName, locale)} • ${initial.residenceWeeks} ${t("weekCount", { count: initial.residenceWeeks })}${accommodationDetails.length ? ` • ${accommodationDetails.join(" • ")}` : ""}`,
        amount: accommodationPrice,
      });
    }

    accommodationAddons.forEach((addon) => {
      const addonDetails = [
        ...(addon.location
          ? [`${t("location")} : ${tx(addon.location, locale)}`]
          : []),
        ...(addon.note ? [tx(addon.note, locale)] : []),
        ...(addon.duration
          ? [
              `${t("from")} : ${formatDateLabel(addon.duration.from as string, locale)} • ${t("to")} : ${formatDateLabel(addon.duration.to as string, locale)}`,
            ]
          : []),
      ].filter(Boolean);

      items.push({
        title: tx(addon.addonName, locale),
        detail: addonDetails.join(" • "),
        amount: addon.amount * initial.residenceWeeks,
      });
    });

    if (initial.hasAirport && transfer) {
      const transferDetails = [
        ...(transfer.transferDescription
          ? [tx(transfer.transferDescription, locale)]
          : []),
        t("pickup", { location: tx(transfer.pickupLocation, locale) }),
        `${t("tripType")} : ${t(
          transfer.tripType === "roundTrip" ? "roundTrip" : "oneWay",
        )}`,
        ...(transfer.note ? [tx(transfer.note, locale)] : []),
      ].filter(Boolean);

      items.push({
        title: t("airportPickup"),
        detail: transferDetails.join(" • "),
        amount: transferPrice,
      });
    }

    const insuranceFee = fees.find((fee) => {
      const name = fee.feeName?.en?.toLowerCase() ?? "";
      const arabicName = fee.feeName?.ar?.toLowerCase() ?? "";
      return name.includes("insurance") || arabicName.includes("التأمين");
    });

    fees
      .filter((fee) => fee !== insuranceFee)
      .forEach((fee) => {
        const feeLabel = fee.feeName?.[locale] ?? fee.feeName?.en ?? "";
        const frequencyLabel =
          fee.feeFrequency === "weekly"
            ? t("frequency.weekly")
            : fee.feeFrequency;
        items.push({
          title: feeLabel,
          detail:
            fee.feeFrequency === "fixed"
              ? ""
              : frequencyLabel
                ? `${frequencyLabel}`
                : "",
          amount: fee.feeAmount ?? 0,
        });
      });

    if (initial.hasInsurance && insuranceFee) {
      items.push({
        title: t("insurance"),
        detail: `(${formatPrice(insuranceFee.feeAmount)} / ${t("frequency.weekly")})`,
        amount: insurancePrice,
      });
    }

    return items;
  }, [
    accommodation,
    accommodationAddons,
    accommodationPrice,
    course,
    courseAddons,
    coursePrice,
    fees,
    initial.hasAccommodation,
    initial.hasAirport,
    initial.hasInsurance,
    initial.residenceWeeks,
    initial.startDate,
    initial.weeks,
    locale,
    t,
    transfer,
    transferPrice,
    insurancePrice,
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    params.delete("locale");
    const query = params.toString();

    setPrintUrl(
      `/api/quotation/print?locale=${locale}${query ? `&${query}` : ""}`,
    );
  }, [locale]);

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#fff7ed_0%,#ffe7d3_45%,#fffaf5_100%)] px-4 py-10 text-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-4xl border border-white/70 bg-white/80 p-5 shadow-2xl shadow-orange-100/70 backdrop-blur xl:p-8 print:shadow-none">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-dark-orange text-2xl font-black text-white">
              PS
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-dark-orange">
                {t("quotation")}
              </p>
              <h1 className="text-2xl font-bold text-gray-dark">
                {pageTitle ?? t("quoteTitle")}
              </h1>
              <p className="mt-1 text-sm text-gray-dark/70">
                {tx(school.schoolName ?? { en: "School", ar: "مدرسة" }, locale)}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            {showPrintButton ? (
              <div className="flex items-center gap-3">
                <a
                  href={printUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Print quotation"
                  className="inline-flex items-center gap-2 rounded-3xl bg-dark-orange px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-5 w-5"
                    aria-hidden
                  >
                    <path d="M6 9V3h12v6" />
                    <rect x="6" y="13" width="12" height="8" rx="2" />
                    <path d="M6 17h12" />
                  </svg>
                  <span>{t("printQuote")}</span>
                </a>
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <section className="rounded-4xl border border-white/70 bg-white/85 p-6 shadow-xl shadow-orange-100/60 backdrop-blur">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-dark-orange">
                    {t("quoteSummary")}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-gray-dark">
                    {t("quoteForStudyJourney")}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-gray-dark/70">
                    {t("quoteDescription")}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-orange-50 px-4 py-3 text-sm text-gray-dark">
                    <p className="font-semibold">{t("quoteReference")}</p>
                    <p className="mt-1 text-xs text-gray-dark/70">
                      {new Date().toLocaleDateString(
                        locale === "ar" ? "ar-SA" : "en-US",
                      )}
                    </p>
                    {initial.startDate ? (
                      <div className="mt-2 space-y-1 text-xs text-gray-dark/70">
                        <p>
                          <span className="font-semibold">{t("from")}:</span>{" "}
                          {formatDateLabel(initial.startDate, locale)}
                        </p>
                        <p>
                          <span className="font-semibold">{t("to")}:</span>{" "}
                          {formatDateLabel(courseEnd, locale)}
                        </p>
                      </div>
                    ) : null}
                  </div>
                  <div className="rounded-2xl bg-orange-50 px-4 py-3 text-sm text-gray-dark">
                    <p className="font-semibold">{t("courseDuration")}</p>
                    {initial.startDate ? (
                      <div className="mt-2 space-y-1 text-xs text-gray-dark/70">
                        <p>
                          <span className="font-semibold">{t("from")}:</span>{" "}
                          {formatDateLabel(initial.startDate, locale)}
                        </p>
                        <p>
                          <span className="font-semibold">{t("to")}:</span>{" "}
                          {formatDateLabel(courseEnd, locale)}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4">
                  <p className="text-sm font-semibold text-gray-dark">
                    {t("destination")}
                  </p>
                  <p className="mt-1 text-sm text-gray-dark/70">
                    {city ? tx(city.cityName, locale) : ""},{" "}
                    {country ? tx(country.countryName, locale) : ""}
                  </p>
                </div>
                <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4">
                  <p className="text-sm font-semibold text-gray-dark">
                    {t("programDetails")}
                  </p>
                  <p className="mt-1 text-sm text-gray-dark/70">
                    {course ? tx(course.courseName, locale) : t("course")}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-4xl border border-white/70 bg-white/85 p-6 shadow-xl shadow-orange-100/60 backdrop-blur">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-dark">
                  {t("selectedServices")}
                </h3>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-dark-orange">
                  {t("preparedForYou")}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {quoteItems.map((item) => (
                  <div
                    key={`${item.title}-${item.amount}-${item.detail}`}
                    className="flex flex-col gap-3 rounded-2xl border border-orange-100 bg-orange-50/40 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <p className="font-semibold text-gray-dark">
                        {item.title}
                      </p>
                      <p className="whitespace-nowrap text-sm font-semibold text-gray-dark">
                        {formatPrice(item.amount)}
                      </p>
                    </div>
                    {item.detail ? (
                      <p className="text-sm text-gray-dark/70">{item.detail}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="rounded-4xl border border-white/70 bg-white/90 p-6 shadow-xl shadow-orange-100/60 backdrop-blur">
              <h3 className="text-xl font-semibold text-gray-dark">
                {t("quoteTotal")}
              </h3>
              <div className="mt-4 space-y-3 text-sm text-gray-dark/80">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span>{t("course")}</span>
                  <span>{formatPrice(coursePrice)}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span>{t("accommodation")}</span>
                  <span>{formatPrice(accommodationPrice)}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span>{t("airportPickup")}</span>
                  <span>{formatPrice(transferPrice)}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span>{t("insurance")}</span>
                  <span>{formatPrice(insurancePrice)}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span>{t("fixedFees")}</span>
                  <span>{formatPrice(fixedFeesTotal)}</span>
                </div>
              </div>
              <div className="mt-5 rounded-2xl bg-dark-orange/10 p-4">
                <div className="flex items-center justify-between text-lg font-semibold text-gray-dark">
                  <span>{t("subtotal")}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-4xl border border-white/70 bg-dark-orange p-6 text-white shadow-xl shadow-orange-200/60">
              <h3 className="text-xl font-semibold">{t("whyProStudent")}</h3>
              <p className="mt-3 text-sm leading-7 text-orange-50">
                {t("marketingCopy")}
              </p>
              <div className="mt-4 rounded-2xl border border-white/20 bg-white/10 p-4 text-sm">
                <p className="font-semibold">{t("contactUs")}</p>
                <div className="mt-2 flex items-center gap-3" dir="ltr">
                  <a
                    href="tel:966580666525"
                    className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="h-4 w-4"
                      aria-hidden
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.12 1.05.38 2.06.78 3.01a2 2 0 0 1-.45 2.11L9.91 11.09a16 16 0 0 0 6 6l1.24-1.24a2 2 0 0 1 2.11-.45c.95.4 1.96.66 3.01.78A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span className="text-sm">+966 58 066 6525</span>
                  </a>

                  <a
                    href="https://wa.me/966580666525"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path
                        fill="currentColor"
                        d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28"
                      />
                    </svg>

                    <span className="text-sm">WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
