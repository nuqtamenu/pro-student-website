"use client";

import { useMemo } from "react";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  countriesV2,
  courseCategoriesV3,
  getCitiesByCountry,
  type SchoolSearchFilters,
} from "@/lib/v2-search-data";
import { type Locale } from "@/lib/data";

type Props = {
  filters: SchoolSearchFilters;
  setFilters: (filters: SchoolSearchFilters) => void;
  locale: Locale;
};

const durations = Array.from({ length: 48 }, (_, index) => index + 1);

export function SearchSidebar({ filters, setFilters, locale }: Props) {
  const t = useTranslations("institutes");

  const cityOptions = useMemo(
    () => getCitiesByCountry(filters.countryId),
    [filters.countryId],
  );
  const courseTypeLabel =
    locale === "ar" ? "اختر نوع الدورة" : "Select Course Type";
  const courseTypePlaceholder = locale === "ar" ? "كل الأنواع" : "All Types";

  return (
    <aside className="rounded-2xl border border-white/20 p-6 shadow-2xl backdrop-blur-xl">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-dark">
            {t("search")}
          </h2>
          <p className="mt-2 text-sm text-gray-dark/75">
            {t("searchDescription")}
          </p>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-dark">
            {t("searchByName")}
          </label>
          <div className="relative">
            <Icon
              icon="lucide:search"
              width={18}
              className="pointer-events-none absolute inset-y-0 inset-s-3 my-auto text-gray-light"
            />
            <input
              value={filters.search}
              onChange={(event) =>
                setFilters({ ...filters, search: event.target.value })
              }
              placeholder={t("searchByName")}
              className="w-full rounded-2xl border border-white/40 bg-white/70 py-3 ps-11 pe-4 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-dark">
            {t("chooseCountry")}
          </label>
          <div className="relative">
            <select
              value={filters.countryId ?? ""}
              onChange={(event) => {
                const countryId = event.target.value
                  ? Number(event.target.value)
                  : undefined;
                setFilters({
                  ...filters,
                  countryId,
                  cityId: undefined,
                });
              }}
              className="w-full rounded-2xl border border-white/40 bg-white/70 py-3 px-4 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white"
            >
              <option value="">{t("chooseCountryPlaceholder")}</option>
              {countriesV2.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name[locale]}
                </option>
              ))}
            </select>
            <Icon
              icon="lucide:chevron-down"
              width={18}
              className="pointer-events-none absolute inset-y-0 inset-e-3 my-auto text-gray-light"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-dark">
            {t("chooseCity")}
          </label>
          <div className="relative">
            <select
              value={filters.cityId ?? ""}
              onChange={(event) => {
                const cityId = event.target.value
                  ? Number(event.target.value)
                  : undefined;
                setFilters({ ...filters, cityId });
              }}
              disabled={!filters.countryId}
              className="w-full rounded-2xl border border-white/40 bg-white/70 py-3 px-4 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              <option value="">{t("chooseCityPlaceholder")}</option>
              {cityOptions.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name[locale]}
                </option>
              ))}
            </select>
            <Icon
              icon="lucide:chevron-down"
              width={18}
              className="pointer-events-none absolute inset-y-0 inset-e-3 my-auto text-gray-light"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-dark">
            {courseTypeLabel}
          </label>
          <div className="relative">
            <select
              value={filters.courseTypeId ?? ""}
              onChange={(event) => {
                const value = event.target.value;
                setFilters({
                  ...filters,
                  courseTypeId: value ? Number(value) : undefined,
                });
              }}
              className="w-full rounded-2xl border border-white/40 bg-white/70 py-3 px-4 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white"
            >
              <option value="">{courseTypePlaceholder}</option>
              {courseCategoriesV3.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.categoryName[locale]}
                </option>
              ))}
            </select>
            <Icon
              icon="lucide:chevron-down"
              width={18}
              className="pointer-events-none absolute inset-y-0 inset-e-3 my-auto text-gray-light"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-dark">
            {t("durationWeeks")}
          </label>
          <select
            value={filters.durationWeeks ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              setFilters({
                ...filters,
                durationWeeks: value ? Number(value) : undefined,
              });
            }}
            className="w-full rounded-2xl border border-white/40 bg-white/70 py-3 px-4 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white"
          >
            <option value="">{t("durationPlaceholder")}</option>
            {durations.map((week) => (
              <option key={week} value={week}>
                {week}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-dark">
            {t("courseStartDate")}
          </label>
          <div className="w-full" dir="ltr">
            <DatePicker
              selected={filters.startDate ? new Date(filters.startDate) : null}
              onChange={(date: Date | null) => {
                if (date) {
                  const dateStr = date.toISOString().split("T")[0];
                  setFilters({ ...filters, startDate: dateStr });
                }
              }}
              placeholderText={t("courseStartDatePlaceholder")}
              filterDate={(date) => date.getDay() === 1}
              dateFormat="yyyy-MM-dd"
              className="w-full rounded-2xl border border-white/40 bg-white/70 py-3 px-4 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white"
              calendarStartDay={1}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              id="accommodation"
              type="checkbox"
              checked={filters.accommodation}
              onChange={(event) =>
                setFilters({ ...filters, accommodation: event.target.checked })
              }
              className="h-4 w-4 accent-dark-orange"
            />
            <label htmlFor="accommodation" className="text-sm text-gray-dark">
              {t("requireAccommodation")}
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              id="airportPickup"
              type="checkbox"
              checked={filters.airportPickup}
              onChange={(event) =>
                setFilters({ ...filters, airportPickup: event.target.checked })
              }
              className="h-4 w-4 accent-dark-orange"
            />
            <label htmlFor="airportPickup" className="text-sm text-gray-dark">
              {t("requireAirportPickup")}
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              id="insurance"
              type="checkbox"
              checked={filters.insurance}
              onChange={(event) =>
                setFilters({ ...filters, insurance: event.target.checked })
              }
              className="h-4 w-4 accent-dark-orange"
            />
            <label htmlFor="insurance" className="text-sm text-gray-dark">
              {t("requireInsurance")}
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
}
