"use client";

import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";

type ContactValues = {
  fullName: string;
  email: string;
  phone: string;
};

const socials = [
  { icon: "ri:twitter-x-fill", href: "#", label: "X" },
  { icon: "mdi:instagram", href: "#", label: "Instagram" },
  { icon: "ic:baseline-whatsapp", href: "#", label: "WhatsApp" },
];

export function ContactSection() {
  const t = useTranslations("contact");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactValues>();

  function onSubmit(data: ContactValues) {
    console.log("[v0] Contact form submitted:", data);
  }

  const inputClass =
    "w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm text-gray-dark outline-none transition focus:border-dark-orange";

  return (
    <section id="contact" className="bg-light-orange/10 py-14 sm:py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-dark-orange">
            {t("label")}
          </span>
          <h2 className="mt-2 text-2xl font-extrabold text-gray-dark sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-light">
            {t("description")}
          </p>
          <div className="mt-6 flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-dark-orange text-white transition hover:bg-red"
              >
                <Icon icon={s.icon} width={20} />
              </a>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5"
        >
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-dark">
              {t("fullName")}
            </label>
            <input
              className={inputClass}
              placeholder={t("fullNamePlaceholder")}
              {...register("fullName", { required: true })}
            />
            {errors.fullName && (
              <span className="mt-1 block text-xs text-red">required</span>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-dark">
              {t("email")}
            </label>
            <input
              type="email"
              className={inputClass}
              placeholder={t("emailPlaceholder")}
              {...register("email", { required: true })}
            />
            {errors.email && (
              <span className="mt-1 block text-xs text-red">required</span>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-dark">
              {t("phone")}
            </label>
            <input
              className={inputClass}
              placeholder={t("phonePlaceholder")}
              {...register("phone", { required: true })}
            />
            {errors.phone && (
              <span className="mt-1 block text-xs text-red">required</span>
            )}
          </div>
          <button
            type="submit"
            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-dark-orange py-3 text-sm font-bold text-white transition hover:bg-red"
          >
            {t("schedule")}
          </button>
        </form>
      </div>
    </section>
  );
}
