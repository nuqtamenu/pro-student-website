"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { tx, type Locale } from "@/lib/data";
import {
  type Accommodation,
  type Course,
  type School,
  type Transfer,
} from "@/lib/v4-dsa";
import { getCityById, getCountryById } from "@/lib/search-data";

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
  return `$${value.toFixed(0)}`;
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
}: Props) {
  const t = useTranslations("schoolBooking");
  const country = getCountryById(school.countryId);
  const city = getCityById(school.cityId);

  const [printUrl, setPrintUrl] = useState(
    `/api/quotation/print?locale=${locale}`,
  );

  const quoteItems = useMemo(() => {
    const items: Array<{ title: string; detail: string; amount: number }> = [];

    if (course) {
      items.push({
        title: t("course"),
        detail: `${tx(course.courseName, locale)} • ${t("studyDuration")}`,
        amount: coursePrice,
      });
    }

    if (initial.hasAccommodation && accommodation) {
      items.push({
        title: t("accommodation"),
        detail: `${tx(accommodation.accommodationName, locale)} • ${initial.residenceWeeks} ${t("weekCount", { count: initial.residenceWeeks })}`,
        amount: accommodationPrice,
      });
    }

    if (initial.hasAirport && transfer) {
      items.push({
        title: t("airportPickup"),
        detail: `${tx(transfer.transferName, locale)}`,
        amount: transferPrice,
      });
    }

    if (initial.hasInsurance) {
      items.push({
        title: t("insurance"),
        detail: t("addInsurance"),
        amount: insurancePrice,
      });
    }

    if (fixedFeesTotal > 0) {
      items.push({
        title: t("fixedFees"),
        detail: fees
          .filter((fee) => fee.feeFrequency === "fixed")
          .map((fee) => fee.feeName?.[locale] ?? fee.feeName?.en)
          .join(", "),
        amount: fixedFeesTotal,
      });
    }

    return items;
  }, [
    accommodation,
    accommodationPrice,
    course,
    coursePrice,
    fees,
    fixedFeesTotal,
    initial.hasAccommodation,
    initial.hasAirport,
    initial.hasInsurance,
    initial.residenceWeeks,
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
          <div className="flex items-center gap-3 print:hidden">
            {showPrintButton ? (
              <a
                href={printUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-dark-orange px-5 py-3 text-sm font-semibold text-white transition hover:bg-red"
              >
                {t("printQuote")}
              </a>
            ) : (
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-full bg-dark-orange px-5 py-3 text-sm font-semibold text-white transition hover:bg-red"
              >
                {t("printQuote")}
              </button>
            )}
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
                <div className="rounded-2xl bg-orange-50 px-4 py-3 text-sm text-gray-dark">
                  <p className="font-semibold">{t("quoteReference")}</p>
                  <p className="mt-1 text-xs text-gray-dark/70">
                    {new Date().toLocaleDateString(
                      locale === "ar" ? "ar-SA" : "en-US",
                    )}
                  </p>
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
                    key={item.title}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-orange-100 bg-orange-50/40 p-4"
                  >
                    <div>
                      <p className="font-semibold text-gray-dark">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm text-gray-dark/70">
                        {item.detail}
                      </p>
                    </div>
                    <p className="whitespace-nowrap text-sm font-semibold text-gray-dark">
                      {formatPrice(item.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-4xl border border-white/70 bg-white/85 p-6 shadow-xl shadow-orange-100/60 backdrop-blur">
              <h3 className="text-xl font-semibold text-gray-dark">
                {t("servicesIncluded")}
              </h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-orange-100 bg-orange-50/40 p-4">
                  <p className="font-semibold text-gray-dark">
                    {t("studySupport")}
                  </p>
                  <p className="mt-2 text-sm text-gray-dark/70">
                    {t("studySupportText")}
                  </p>
                </div>
                <div className="rounded-2xl border border-orange-100 bg-orange-50/40 p-4">
                  <p className="font-semibold text-gray-dark">
                    {t("arrivalSupport")}
                  </p>
                  <p className="mt-2 text-sm text-gray-dark/70">
                    {t("arrivalSupportText")}
                  </p>
                </div>
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
                <p className="mt-2">admission@prostudent.com.sa</p>
                <p dir="ltr">+966 58 066 6525</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
