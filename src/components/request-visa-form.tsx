"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

type FormValues = {
  name: string;
  email: string;
  nationality: string;
  phone: string;
  country: string;
  visaType: string;
  note: string;
};

const countryOptions = [
  { value: "saudi-arabia", labelKey: "countryOptionSaudiArabia" },
  { value: "united-kingdom", labelKey: "countryOptionUnitedKingdom" },
  { value: "canada", labelKey: "countryOptionCanada" },
  { value: "australia", labelKey: "countryOptionAustralia" },
];

const visaTypeOptions = [
  { value: "student", labelKey: "visaTypeOptionStudent" },
  { value: "work", labelKey: "visaTypeOptionWork" },
  { value: "tourist", labelKey: "visaTypeOptionTourist" },
  { value: "other", labelKey: "visaTypeOptionOther" },
];

export default function RequestVisaForm() {
  const t = useTranslations("requestVisaPage");
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ mode: "onTouched" });

  const onSubmit = (data: FormValues) => {
    setSubmitted(true);
    console.log("Request visa form submitted", data);
    reset();
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="glass rounded-4xl border border-white/20 bg-white/20 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-dark sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-dark/75">
            {t("description")}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-gray-dark">
                {t("name")}
              </span>
              <input
                {...register("name", { required: t("nameRequired") })}
                className="w-full rounded-2xl border border-white/40 bg-white/70 px-4 py-3 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white"
                placeholder={t("namePlaceholder")}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-rose-600">
                  {errors.name.message}
                </p>
              )}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-gray-dark">
                {t("email")}
              </span>
              <input
                {...register("email", {
                  required: t("emailRequired"),
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t("emailInvalid"),
                  },
                })}
                type="email"
                className="w-full rounded-2xl border border-white/40 bg-white/70 px-4 py-3 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white"
                placeholder={t("emailPlaceholder")}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-rose-600">
                  {errors.email.message}
                </p>
              )}
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-gray-dark">
                {t("nationality")}
              </span>
              <input
                {...register("nationality", {
                  required: t("nationalityRequired"),
                })}
                className="w-full rounded-2xl border border-white/40 bg-white/70 px-4 py-3 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white"
                placeholder={t("nationalityPlaceholder")}
              />
              {errors.nationality && (
                <p className="mt-1 text-sm text-rose-600">
                  {errors.nationality.message}
                </p>
              )}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-gray-dark">
                {t("phone")}
              </span>
              <input
                {...register("phone", {
                  required: t("phoneRequired"),
                  pattern: {
                    value: /^[0-9+\-\s]{7,20}$/,
                    message: t("phoneInvalid"),
                  },
                })}
                className="w-full rounded-2xl border border-white/40 bg-white/70 px-4 py-3 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white"
                placeholder={t("phonePlaceholder")}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-rose-600">
                  {errors.phone.message}
                </p>
              )}
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-gray-dark">
                {t("country")}
              </span>
              <select
                {...register("country", { required: t("countryRequired") })}
                className="w-full appearance-none rounded-2xl border border-white/40 bg-white/70 px-4 py-3 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white"
              >
                <option value="">{t("countryPlaceholder")}</option>
                {countryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.labelKey)}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="mt-1 text-sm text-rose-600">
                  {errors.country.message}
                </p>
              )}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-gray-dark">
                {t("visaType")}
              </span>
              <select
                {...register("visaType", { required: t("visaTypeRequired") })}
                className="w-full appearance-none rounded-2xl border border-white/40 bg-white/70 px-4 py-3 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white"
              >
                <option value="">{t("visaTypePlaceholder")}</option>
                {visaTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.labelKey)}
                  </option>
                ))}
              </select>
              {errors.visaType && (
                <p className="mt-1 text-sm text-rose-600">
                  {errors.visaType.message}
                </p>
              )}
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-dark">
              {t("note")}
            </span>
            <textarea
              {...register("note", { required: t("noteRequired") })}
              rows={5}
              className="w-full rounded-2xl border border-white/40 bg-white/70 px-4 py-3 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white"
              placeholder={t("notePlaceholder")}
            />
            {errors.note && (
              <p className="mt-1 text-sm text-rose-600">
                {errors.note.message}
              </p>
            )}
          </label>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-dark-orange px-8 py-3 text-sm font-semibold text-white transition hover:bg-red disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitted ? t("sent") : t("submit")}
            </button>
          </div>
        </form>

        <div className="mt-10 rounded-3xl bg-white/80 p-6 text-sm text-gray-dark/75 shadow-sm">
          <p className="font-semibold text-gray-dark">
            {t("priceIncludesLabel")}
          </p>
          <p className="mt-2">{t("priceIncludes")}</p>
          <p className="mt-4 font-semibold text-gray-dark">
            {t("priceExcludesLabel")}
          </p>
          <p className="mt-2">{t("priceExcludes")}</p>
        </div>
      </div>
    </div>
  );
}
