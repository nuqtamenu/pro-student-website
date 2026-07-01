"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { tx, type Locale } from "../lib/data";
import {
  type Accommodation,
  type AccommodationAddon,
  type Course,
  type CourseAddon,
  type School,
  type Transfer,
} from "../lib/v4-dsa";
import { getCityById, getCountryById } from "../lib/search-data";

type Props = {
  school: School;
  course?: Course;
  accommodation?: Accommodation;
  transfer?: Transfer;
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
  courseAddons?: CourseAddon[];
  accommodationAddons?: AccommodationAddon[];
  coursePrice: number;
  courseAddonsPrice: number;
  accommodationAddonsPrice: number;
  accommodationPrice: number;
  transferPrice: number;
  insurancePrice: number;
  fixedFeesTotal: number;
  subtotal: number;
  offerNumber?: string | number;
  /** ISO date string for the "Date:" line. Defaults to today. */
  issueDate?: string;
  currency?: string;
  bank?: {
    accountNameArabic?: string;
    iban?: string;
    accountNumber?: string;
  };
  phoneNumber?: string;
  whatsappNumber?: string;
};

function formatAmount(value: number, symbol: string) {
  return `${symbol}${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function addWeeks(dateStr: string | undefined, weeks: number) {
  if (!dateStr) return undefined;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return undefined;
  d.setDate(d.getDate() + weeks * 7);
  return d.toISOString().slice(0, 10);
}

function formatDateLabel(value: string | undefined, locale: Locale) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

type QuoteRow = {
  id: string;
  title: string;
  subLines: string[];
  from?: string;
  to?: string;
  duration?: string;
  amount: number | null;
};

export default function InvoiceQuotePage({
  school,
  course,
  accommodation,
  transfer,
  locale,
  initial,
  fees,
  courseAddons,
  accommodationAddons,
  coursePrice,
  courseAddonsPrice,
  accommodationAddonsPrice,
  accommodationPrice,
  transferPrice,
  insurancePrice,
  fixedFeesTotal,
  subtotal,
  offerNumber,
  issueDate,
  currency = "GBP",
  bank,
  phoneNumber,
  whatsappNumber,
}: Props) {
  const t = useTranslations("schoolBooking");
  const isRtl = locale === "ar";
  const country = getCountryById(school.countryId);
  const city = getCityById(school.cityId);

  const firstCoursePlan = course?.coursePlans?.[0];

  const courseEnd = useMemo(
    () => addWeeks(initial.startDate, initial.weeks),
    [initial.startDate, initial.weeks],
  );

  const accommodationEnd = useMemo(
    () => addWeeks(initial.startDate, initial.residenceWeeks),
    [initial.startDate, initial.residenceWeeks],
  );

  const currencySymbol = country?.currency?.symbol || "£";
  const currencyCode = currency ?? country?.currency?.code ?? "GBP";

  const formattedDate = useMemo(() => {
    const d = issueDate ? new Date(issueDate) : new Date();
    return d.toLocaleDateString(isRtl ? "ar-SA" : "en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, [issueDate, isRtl]);

  const rows = useMemo<QuoteRow[]>(() => {
    const list: QuoteRow[] = [];

    if (course) {
      const subLines = [
        ...(firstCoursePlan?.lessonsPerWeek
          ? [`${firstCoursePlan.lessonsPerWeek} ${t("lessonsPerWeek")}`]
          : []),
        ...(course.courseDescription
          ? [tx(course.courseDescription, locale)]
          : []),
        ...(course.courseIntensity
          ? [`${t("courseIntensity")}: ${tx(course.courseIntensity, locale)}`]
          : []),
        ...(course.requiredLevel
          ? [`${t("requiredLevel")}: ${tx(course.requiredLevel, locale)}`]
          : []),
        ...(firstCoursePlan?.note ? [tx(firstCoursePlan.note, locale)] : []),
      ].filter(Boolean);

      list.push({
        id: "course",
        title: tx(course.courseName, locale),
        subLines,
        from: initial.startDate,
        to: courseEnd,
        duration: `${t("weekCount", { count: initial.weeks })}`,
        amount: coursePrice,
      });
    }

    if (courseAddons?.length) {
      courseAddons.forEach((addon) => {
        const subLines = [
          ...(typeof addon.lessons === "number"
            ? [`${addon.lessons} ${t("lessonsPerWeek")}`]
            : []),
          ...(addon.note ? [tx(addon.note, locale)] : []),
        ].filter(Boolean);

        list.push({
          id: `course-addon-${addon.id}`,
          title: tx(addon.addonName, locale),
          subLines,
          amount: addon.price * initial.weeks,
        });
      });
    }

    if (initial.hasAirport && transfer) {
      list.push({
        id: "transfer",
        title: tx(transfer.transferName, locale),
        subLines: [
          ...(transfer.transferDescription
            ? [tx(transfer.transferDescription, locale)]
            : []),
          `${t("pickup")}: ${tx(transfer.pickupLocation, locale)}`,
          `${t("tripType")}: ${t(transfer.tripType === "roundTrip" ? "roundTrip" : "oneWay")}`,
          ...(transfer.note ? [tx(transfer.note, locale)] : []),
        ].filter(Boolean),
        amount: transferPrice,
      });
    }

    if (initial.hasAccommodation && accommodation) {
      const subLines = [
        ...(accommodation.accommodationDescription
          ? [tx(accommodation.accommodationDescription, locale)]
          : []),
        ...(accommodation.note ? [tx(accommodation.note, locale)] : []),
        ...(accommodation.location?.length
          ? [
              `${t("location")}: ${accommodation.location
                .map((entry) => tx(entry.name, locale))
                .join(", ")}`,
            ]
          : []),
        ...(accommodation.minimumAge
          ? [`${t("minAge", { age: accommodation.minimumAge })}`]
          : []),
      ].filter(Boolean);

      list.push({
        id: "accommodation",
        title: tx(accommodation.accommodationName, locale),
        subLines,
        from: initial.startDate,
        to: accommodationEnd,
        duration: `${t("weekCount", { count: initial.residenceWeeks })}`,
        amount: accommodationPrice,
      });
    }

    if (accommodationAddons?.length) {
      accommodationAddons.forEach((addon) => {
        list.push({
          id: `accommodation-addon-${addon.id}`,
          title: tx(addon.addonName, locale),
          subLines: [
            ...(addon.location
              ? [`${t("location")}: ${tx(addon.location, locale)}`]
              : []),
            ...(addon.note ? [tx(addon.note, locale)] : []),
            ...(addon.duration
              ? [
                  `${t("from")}: ${formatDateLabel(addon.duration.from as string, locale)} · ${t("to")}: ${formatDateLabel(addon.duration.to as string, locale)}`,
                ]
              : []),
          ].filter(Boolean),
          duration: `${t("weekCount", { count: initial.residenceWeeks })}`,
          amount: addon.amount * initial.residenceWeeks,
        });
      });
    }

    fees
      .filter((fee) => fee.feeFrequency === "fixed")
      .forEach((fee, i) => {
        list.push({
          id: `fixed-fee-${i}`,
          title: fee.feeName?.[locale] ?? fee.feeName?.en ?? "",
          subLines: [],
          amount: fee.feeAmount ?? null,
        });
      });

    fees
      .filter((fee) => fee.feeFrequency === "weekly")
      .forEach((fee, i) => {
        list.push({
          id: `weekly-fee-${i}`,
          title: fee.feeName?.[locale] ?? fee.feeName?.en ?? "",
          subLines: [],
          duration: t("frequency.weekly"),
          amount: fee.feeAmount ?? null,
        });
      });

    if (initial.hasInsurance) {
      list.push({
        id: "insurance",
        title: t("addInsurance"),
        subLines: [
          t("insuranceSummary", {
            total: formatAmount(insurancePrice, currencySymbol),
            weekly: formatAmount(
              insurancePrice / Math.max(initial.weeks || 1, 1),
              currencySymbol,
            ),
          }),
        ],
        amount: insurancePrice,
      });
    }

    return list;
  }, [
    accommodation,
    accommodationAddons,
    accommodationPrice,
    accommodationEnd,
    course,
    courseEnd,
    firstCoursePlan,
    courseAddons,
    coursePrice,
    fees,
    initial.hasAccommodation,
    initial.hasAirport,
    initial.hasInsurance,
    initial.residenceWeeks,
    initial.startDate,
    initial.weeks,
    insurancePrice,
    locale,
    t,
    transfer,
    transferPrice,
    currencySymbol,
  ]);

  void fixedFeesTotal;
  void courseAddonsPrice;
  void accommodationAddonsPrice;

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen bg-white font-sans text-gray-dark"
    >
      <div className="h-0.75 bg-dark-orange" />

      <header className="bg-orange-50 border-b border-orange-100 px-6 py-6 shadow-sm sm:px-10 sm:py-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-start justify-between gap-6">
          <div className="space-y-3 text-sm">
            <p>
              <span className="font-bold">{t("date")}:</span> {formattedDate}
            </p>
            {offerNumber ? (
              <p>
                <span className="font-bold">{t("offerNumber")}:</span>{" "}
                {offerNumber}
              </p>
            ) : null}
            <p className="leading-6">
              {tx(school.schoolName ?? { en: "School", ar: "مدرسة" }, locale)} ,
              <br />
              {country ? tx(country.countryName, locale) : ""},{" "}
              {city ? tx(city.cityName, locale) : ""}
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <Image
              src="/logo.png"
              alt={t("studyAbroadLogoAlt")}
              width={100}
              height={40}
              className=""
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8 sm:px-10">
        <div className="relative mt-4 overflow-hidden rounded-md border border-orange-100 bg-orange-50/70 shadow-sm">
          <Image
            src="/logos/study-abroad-watermark.svg"
            alt=""
            aria-hidden="true"
            width={192}
            height={192}
            className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 opacity-10"
          />

          <table className="relative w-full border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-dark-orange text-white">
                <th className="px-4 py-3 text-start font-semibold">
                  {t("bookingDetails")}
                </th>
                <th className="px-3 py-3 text-start font-semibold">
                  {t("from")}
                </th>
                <th className="px-3 py-3 text-start font-semibold">
                  {t("to")}
                </th>
                <th className="px-3 py-3 text-start font-semibold">
                  {t("duration")}
                </th>
                <th className="px-4 py-3 text-end font-semibold">
                  {t("amount")} | {currencyCode}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-200 bg-white">
                  <td className="px-4 py-3 align-top">
                    <p className="font-medium text-gray-dark">{row.title}</p>
                    {row.subLines.map((line) => (
                      <p key={line} className="text-gray-light">
                        {line}
                      </p>
                    ))}
                  </td>
                  <td className="px-3 py-3 align-top text-gray-dark">
                    {formatDateLabel(row.from, locale)}
                  </td>
                  <td className="px-3 py-3 align-top text-gray-dark">
                    {formatDateLabel(row.to, locale)}
                  </td>
                  <td className="px-3 py-3 align-top text-gray-dark">
                    {row.duration ?? ""}
                  </td>
                  <td className="px-4 py-3 text-end align-top font-medium text-gray-dark">
                    {row.amount != null
                      ? formatAmount(row.amount, currencySymbol)
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-dark-orange text-white">
                <td colSpan={3} className="px-4 py-3 font-semibold">
                  {t("total")}
                </td>
                <td className="px-3 py-3" />
                <td className="px-4 py-3 text-end font-semibold">
                  {formatAmount(subtotal, currencySymbol)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <ul className="mt-4 space-y-2 text-xs sm:text-sm">
          <li className="flex gap-2 text-dark-orange">
            <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-dark-orange" />
            <span>{t("noticeExchangeRate")}</span>
          </li>
          <li className="flex gap-2 text-dark-orange">
            <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-dark-orange" />
            <span>{t("noticeInstitutePrices")}</span>
          </li>
          <li className="flex gap-2 font-bold text-gray-dark">
            <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-dark-orange" />
            <span>{t("noticeQuoteValidity")}</span>
          </li>
          <li className="flex gap-2 text-dark-orange">
            <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-dark-orange" />
            <span>{t("noticeBookingNotConfirmed")}</span>
          </li>
        </ul>

        <div className="mt-6 border-t border-gray-200" />

        {bank && (bank.accountNameArabic || bank.iban || bank.accountNumber) ? (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-orange-100 bg-orange-50/70 p-4">
            <div className="space-y-2 text-xs sm:text-sm">
              <p>
                <span className="font-bold">{t("accountName")}:</span>{" "}
                <span dir="rtl">{bank.accountNameArabic ?? ""}</span>
              </p>
              <p>
                <span className="font-bold">{t("iban")}:</span>{" "}
                {bank.iban ?? ""}
              </p>
              <p>
                <span className="font-bold">{t("accountNumber")}:</span>{" "}
                {bank.accountNumber ?? ""}
              </p>
            </div>
            <Image
              src="/logos/al-rajhi-bank-logo.svg"
              alt="Al Rajhi Bank"
              width={120}
              height={48}
              className="h-12 w-auto"
            />
          </div>
        ) : null}

        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-dark mb-4">
            {t("bankDetails")}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-base">
                <span className="font-medium">{t("accountName")}:</span>{" "}
                <span>{t("bankAccountNameValue")}</span>
              </p>
              <p className="text-base">
                <span className="font-medium">{t("accountNumber")}:</span>{" "}
                <span>25500000605207</span>
              </p>
              <p className="text-base">
                <span className="font-medium">{t("iban")}:</span>{" "}
                <span>SA7710000025500000605207</span>
              </p>
            </div>
            <div className="flex items-center justify-center flex-col gap-2">
              <Image
                src="/images/snb.svg"
                alt={t("bankName")}
                width={120}
                height={48}
                className="h-12 w-auto"
              />
              <p className="text-lg font-bold text-gray-dark">
                {t("bankName")}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200" />

        <div className="mt-6 flex flex-col items-center justify-center gap-3 text-sm font-medium text-dark-orange sm:flex-row">
          <a
            href="tel:966580666525"
            className="flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50/80 px-4 py-2 transition hover:bg-orange-100"
          >
            <CallIcon />
            <span dir="ltr">{phoneNumber ?? "966580666525"}</span>
          </a>
          <span className="text-gray-200">|</span>
          <a
            href="https://wa.me/966580666525"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50/80 px-4 py-2 transition hover:bg-orange-100"
          >
            <WhatsAppIcon />
            <span dir="ltr">
              {whatsappNumber ?? phoneNumber ?? "966580666525"}
            </span>
          </a>
        </div>
      </main>
    </div>
  );
}

function CallIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 flex-none rounded-full bg-dark-orange p-1 text-white"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.3 2.2Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 flex-none rounded-full bg-dark-orange p-1 text-white"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.4A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.5-1.2l-.3-.2-3 .8.8-2.9-.2-.3a8.2 8.2 0 1 1 7.2 3.8Zm4.5-6.2c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.2.2-.3.2-.5.1-.2-.1-1-.4-2-1.2-.7-.7-1.2-1.5-1.4-1.7-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.3.2-.4.1-.2 0-.4 0-.5l-.7-1.7c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.9 2.9 4.5 4 .6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  );
}
