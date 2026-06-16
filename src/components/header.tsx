"use client";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { LanguageSwitcher } from "./language-switcher";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import Link from "next/link";
export function Header() {
  const t = useTranslations("header");
  const locale = useLocale() as "en" | "ar";
  const navT = useTranslations("nav");
  const [openMenu, setOpenMenu] = useState(false);
  const navLinks = [
    {
      href: (locale: "en" | "ar") => `/${locale}`,
      icon: "lucide:home",
      label: "home",
    },
    {
      href: (locale: "en" | "ar") => `/${locale}/courses`,
      icon: "lucide:book-open-check",
      label: "courses",
    },
    {
      href: (locale: "en" | "ar") => `/${locale}/institutes`,
      icon: "lucide:school",
      label: "institutes",
    },
    {
      href: (locale: "en" | "ar") => `/${locale}/destinations`,
      icon: "iconoir:globe",
      label: "destinations",
    },
    {
      href: (locale: "en" | "ar") => `/${locale}/blogs`,
      icon: "material-symbols:article-outline",
      label: "blogs",
    },
    {
      href: (locale: "en" | "ar") => `/${locale}/contact`,
      icon: "bytesize:telephone",
      label: "contact",
      nowrap: true, // optional flag for text-nowrap
    },
    {
      href: (locale: "en" | "ar") => `/${locale}/request-visa`,
      icon: "solar:passport-linear",
      label: "requestVisa",
      nowrap: true, // optional flag for text-nowrap
    },
  ];

  return (
    <header dir="ltr">
      <div className="bg-white h-25">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Left cluster */}
          <div className="flex items-center gap-3 sm:gap-5">
            <a
              href="tel:966580666525"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-dark transition hover:text-dark-orange"
            >
              <Icon
                icon="lucide:phone"
                width={16}
                className="text-dark-orange"
              />
              <span className="hidden sm:inline" dir="ltr">
                +966 58 066 6525
              </span>
            </a>
            <span className="hidden h-4 w-px bg-black/10 sm:block" />
            <LanguageSwitcher />
            <span className="hidden h-4 w-px bg-black/10 sm:block" />
            <Link
              href={"https://maps.app.goo.gl/oUMif88UVAuj2jqe7"}
              target="_blank"
              type="button"
              className="hidden items-center gap-1.5 text-sm font-medium text-gray-dark transition hover:text-dark-orange sm:flex"
            >
              <Icon
                icon="lucide:map-pin"
                width={16}
                className="text-dark-orange"
              />
              {t("officeLocation")}
            </Link>
          </div>

          {/* Center logo */}
          <div className="absolute left-1/2 top-3 -translate-x-1/2">
            <Image
              src="/logo.png"
              alt="Pro Student"
              width={80}
              height={100}
              className="h-20 w-auto object-contain"
              unoptimized
            />
          </div>

          {/* Right cluster */}
          <button
            type="button"
            onClick={() => setOpenMenu((prev) => !prev)}
            className="flex items-center gap-2 text-sm font-medium text-gray-dark transition hover:text-dark-orange cursor-pointer"
          >
            <span className="hidden sm:inline">{t("menu")}</span>
            {!openMenu ? (
              <Icon icon="lucide:menu" width={22} />
            ) : (
              <Icon icon="lucide:x" width={22} />
            )}
          </button>
        </div>
      </div>

      <div
        className={`${openMenu ? "h-20" : "h-0"} overflow-hidden transition-all duration-300 flex items-center justify-center`}
        dir={locale === "en" ? "ltr" : "rtl"}
      >
        <div className="py-4 w-full bg-white flex flex-wrap px-4 items-center justify-center gap-2 sm:gap-4 mx-auto">
          {navLinks.map(({ href, icon, label }) => (
            <Link
              key={label}
              href={href(locale)}
              className="flex flex-col gap-1 items-center justify-center font-medium hover:text-dark-orange transition"
            >
              <Icon icon={icon} className="size-6" />
              <span className="text-nowrap text-sm">{navT(label)}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
