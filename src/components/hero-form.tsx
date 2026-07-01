"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { tx, type Locale } from "@/lib/data";
import {
  countriesV2,
  courseCategoriesV3,
  getCitiesByCountry,
} from "../lib/search-data";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
type FormValues = {
  country: string;
  city: string;
  courseType: string;
  startDate: string;
  duration: string;
  accommodation: string;
  airportPickup: string;
  insurance: string;
};

const durations = Array.from({ length: 48 }, (_, i) => i + 1);

export function HeroForm() {
  const t = useTranslations("hero");
  const locale = useLocale() as Locale;

  const [showAdvanced, setShowAdvanced] = useState(false);
  const { register, handleSubmit, watch, setValue, control } =
    useForm<FormValues>({
      defaultValues: {
        country: "",
        city: "",
        courseType: "",
        startDate: "",
        duration: "",
        accommodation: "no",
        airportPickup: "no",
        insurance: "no",
      },
    });

  const country = watch("country");

  const availableCities = country ? getCitiesByCountry(Number(country)) : [];
  const availableCourseTypes = courseCategoriesV3;

  const router = useRouter();
  const routerLocale = useLocale() as Locale;

  function onSubmit(data: FormValues) {
    const params = new URLSearchParams();

    if (data.country) params.set("country_id", data.country);
    if (data.city) params.set("city_id", data.city);
    if (data.courseType) params.set("course_type_id", data.courseType);
    if (data.duration) params.set("duration_weeks", data.duration);
    if (data.startDate) params.set("start_date", data.startDate);
    if (data.accommodation === "yes") params.set("accommodation", "1");
    if (data.airportPickup === "yes") params.set("airport_pickup", "1");
    if (data.insurance === "yes") params.set("insurance", "1");

    const queryString = params.toString();
    const href = `/${routerLocale}/schools${queryString ? `?${queryString}` : ""}`;

    router.push(href);
  }

  const selectClass =
    "w-full appearance-none rounded-lg border border-white/40 bg-white/70 px-3 py-2.5 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white";
  const labelClass = "mb-1.5 block text-xs font-semibold drop-shadow";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="backdrop-blur-xs bg-white/20 border-1/2 border-white/40 rounded-2xl p-4 shadow-2xl sm:p-5"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* Country */}
        <div>
          <label className={labelClass}>{t("selectCountry")}</label>
          <div className="relative">
            <select
              className={selectClass}
              {...register("country")}
              onChange={(e) => {
                setValue("country", e.target.value);
                setValue("city", "");
              }}
            >
              <option value="">{t("selectCountryPlaceholder")}</option>
              {countriesV2.map((c) => (
                <option key={c.id} value={c.id}>
                  {tx(c.countryName, locale)}
                </option>
              ))}
            </select>
            <Chevron />
          </div>
        </div>

        {/* City */}
        <div>
          <label className={labelClass}>{t("selectCity")}</label>
          <div className="relative">
            <select
              className={selectClass}
              disabled={!country}
              {...register("city")}
              onChange={(e) => {
                setValue("city", e.target.value);
              }}
            >
              <option value="">{t("selectCityPlaceholder")}</option>
              {availableCities.map((c) => (
                <option key={c.id} value={c.id}>
                  {tx(c.cityName, locale)}
                </option>
              ))}
            </select>
            <Chevron />
          </div>
        </div>

        {/* Course type */}
        <div>
          <label className={labelClass}>{t("selectCourseType")}</label>
          <div className="relative">
            <select
              className={selectClass}
              {...register("courseType")}
              onChange={(e) => setValue("courseType", e.target.value)}
            >
              <option value="">{t("selectCourseTypePlaceholder")}</option>
              {availableCourseTypes.map((category) => (
                <option key={category.id} value={category.id}>
                  {tx(category.categoryName, locale)}
                </option>
              ))}
            </select>
            <Chevron />
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className={labelClass}>{t("courseDuration")}</label>
          <div className="relative">
            <select className={selectClass} {...register("duration")}>
              <option value="">{t("courseDurationPlaceholder")}</option>
              {durations.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <Chevron />
          </div>
        </div>

        {/* Start date */}
        <div className="">
          <label className={labelClass}>{t("courseStartDate")}</label>
          <div className="w-full" dir="ltr">
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  placeholderText={t("courseStartDatePlaceholder")}
                  filterDate={(date) => date.getDay() === 1}
                  dateFormat="yyyy-MM-dd"
                  className={selectClass}
                  calendarStartDay={1}
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date: Date | null) => {
                    setValue(
                      "startDate",
                      date ? date.toISOString().split("T")[0] : "",
                    );
                  }}
                />
              )}
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          className="text-sm font-semibold text-dark-orange"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? t("hideAdvancedOptions") : t("showAdvancedOptions")}
        </button>
      </div>

      {showAdvanced ? (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="flex items-center gap-3">
            <input
              id="accommodation"
              type="checkbox"
              checked={watch("accommodation") === "yes"}
              onChange={(event) =>
                setValue("accommodation", event.target.checked ? "yes" : "no")
              }
              className="h-4 w-4 accent-dark-orange"
            />
            <label htmlFor="accommodation" className="text-sm text-gray-dark">
              {t("accommodation")}
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              id="airportPickup"
              type="checkbox"
              checked={watch("airportPickup") === "yes"}
              onChange={(event) =>
                setValue("airportPickup", event.target.checked ? "yes" : "no")
              }
              className="h-4 w-4 accent-dark-orange"
            />
            <label htmlFor="airportPickup" className="text-sm text-gray-dark">
              {t("airportPickup")}
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              id="insurance"
              type="checkbox"
              checked={watch("insurance") === "yes"}
              onChange={(event) =>
                setValue("insurance", event.target.checked ? "yes" : "no")
              }
              className="h-4 w-4 accent-dark-orange"
            />
            <label htmlFor="insurance" className="text-sm text-gray-dark">
              {t("requireInsurance")}
            </label>
          </div>
        </div>
      ) : null}

      <div className="mt-4">
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-dark-orange px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-red"
        >
          {t("search")}
        </button>
      </div>
    </form>
  );
}

function Chevron() {
  return (
    <Icon
      icon="lucide:chevron-down"
      width={16}
      className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-gray-light"
    />
  );
}

function YesNo({
  label,
  value,
  onChange,
  yes,
  no,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  yes: string;
  no: string;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-xs font-semibold drop-shadow">{label}</legend>
      <div className="flex gap-2">
        {[
          { v: "yes", l: yes },
          { v: "no", l: no },
        ].map((opt) => (
          <label
            key={opt.v}
            className={`inline-flex items-center gap-2 rounded-md border px-3 py-1 text-xs font-semibold transition ${
              value === opt.v
                ? "bg-dark-orange text-white border-dark-orange"
                : "bg-transparent hover:bg-white/50 border-transparent"
            }`}
          >
            <input
              type="radio"
              // name={name}
              value={opt.v}
              checked={value === opt.v}
              onChange={() => onChange(opt.v)}
              className="h-4 w-4 accent-dark-orange"
            />
            {opt.l}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
