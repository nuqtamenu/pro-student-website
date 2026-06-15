"use client";

import { useForm } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@iconify/react";
import {
  cities,
  schoolsByCity,
  coursesBySchool,
  tx,
  type Locale,
} from "@/lib/data";

type FormValues = {
  destination: string;
  school: string;
  course: string;
  startDate: string;
  duration: string;
  accommodation: string;
  airportPickup: string;
};

const durations = ["2", "4", "8", "12", "24", "36"];

export function HeroForm() {
  const t = useTranslations("hero");
  const locale = useLocale() as Locale;

  const { register, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      destination: "",
      school: "",
      course: "",
      startDate: "",
      duration: "",
      accommodation: "no",
      airportPickup: "no",
    },
  });

  const destination = watch("destination");
  const school = watch("school");

  const availableSchools = destination
    ? schoolsByCity(Number(destination))
    : [];
  const availableCourses = school ? coursesBySchool(Number(school)) : [];

  function onSubmit(data: FormValues) {
    console.log("[v0] Hero quote form submitted:", data);
  }

  const selectClass =
    "w-full appearance-none rounded-lg border border-white/40 bg-white/70 px-3 py-2.5 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white";
  const labelClass =
    "mb-1.5 block text-xs font-semibold text-white drop-shadow";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="glass rounded-2xl p-4 shadow-2xl sm:p-5"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* Destination */}
        <div>
          <label className={labelClass}>{t("selectDestination")}</label>
          <div className="relative">
            <select
              className={selectClass}
              {...register("destination")}
              onChange={(e) => {
                setValue("destination", e.target.value);
                setValue("school", "");
                setValue("course", "");
              }}
            >
              <option value="">{t("selectDestination")}</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {tx(c.name, locale)}
                </option>
              ))}
            </select>
            <Chevron />
          </div>
        </div>

        {/* School */}
        <div>
          <label className={labelClass}>{t("selectSchool")}</label>
          <div className="relative">
            <select
              className={selectClass}
              disabled={!destination}
              {...register("school")}
              onChange={(e) => {
                setValue("school", e.target.value);
                setValue("course", "");
              }}
            >
              <option value="">{t("selectSchool")}</option>
              {availableSchools.map((s) => (
                <option key={s.id} value={s.id}>
                  {tx(s.name, locale)}
                </option>
              ))}
            </select>
            <Chevron />
          </div>
        </div>

        {/* Course */}
        <div>
          <label className={labelClass}>{t("selectCourse")}</label>
          <div className="relative">
            <select
              className={selectClass}
              disabled={!school}
              {...register("course")}
            >
              <option value="">{t("selectCourse")}</option>
              {availableCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {tx(c.name, locale)}
                </option>
              ))}
            </select>
            <Chevron />
          </div>
        </div>

        {/* Start date */}
        <div>
          <label className={labelClass}>{t("courseStartDate")}</label>
          <input
            type="date"
            className={selectClass}
            {...register("startDate")}
          />
        </div>

        {/* Duration */}
        <div>
          <label className={labelClass}>{t("courseDuration")}</label>
          <div className="relative">
            <select className={selectClass} {...register("duration")}>
              <option value="">{t("courseDuration")}</option>
              {durations.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <Chevron />
          </div>
        </div>
      </div>

      {/* Yes / No options */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <YesNo
          label={t("accommodation")}
          name="accommodation"
          value={watch("accommodation")}
          onChange={(v) => setValue("accommodation", v)}
          yes={t("yes")}
          no={t("no")}
        />
        <YesNo
          label={t("airportPickup")}
          name="airportPickup"
          value={watch("airportPickup")}
          onChange={(v) => setValue("airportPickup", v)}
          yes={t("yes")}
          no={t("no")}
        />
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-dark-orange px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-red"
        >
          <Icon icon="lucide:search" width={18} />
          Get A Quote
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
      <legend className="text-xs font-semibold text-white drop-shadow">
        {label}
      </legend>
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
                : "bg-white/70 text-gray-dark border-transparent hover:bg-white"
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
