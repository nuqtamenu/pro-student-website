"use client";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { LanguageSwitcher } from "./language-switcher";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import Link from "next/link";
export function Header() {
  const t = useTranslations("header");
  const locale = useLocale();
  const navT = useTranslations("nav");
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <header className="relative z-30" dir="ltr">
      <div className="bg-white h-25">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Left cluster */}
          <div className="flex items-center gap-3 sm:gap-5">
            <a
              href="tel:0580666525"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-dark transition hover:text-dark-orange"
            >
              <Icon
                icon="lucide:phone"
                width={16}
                className="text-dark-orange"
              />
              <span className="hidden sm:inline">{t("phone")}</span>
            </a>
            <span className="hidden h-4 w-px bg-black/10 sm:block" />
            <LanguageSwitcher />
            <span className="hidden h-4 w-px bg-black/10 sm:block" />
            <button
              type="button"
              className="hidden items-center gap-1.5 text-sm font-medium text-gray-dark transition hover:text-dark-orange sm:flex"
            >
              <Icon
                icon="lucide:map-pin"
                width={16}
                className="text-dark-orange"
              />
              {t("officeLocation")}
            </button>
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

      {/* Tagline strip */}
      <div className="">
        <p className="px-4 text-center font-bold tracking-wid mb-2">
          {t("tagline")}
        </p>
      </div>

      {openMenu && (
        <div className="py-4 w-full bg-white flex items-center justify-between gap-6 mx-auto max-w-100 px-4">
          <Link
            href={"/" + locale}
            className="flex flex-col gap-2 items-center justify-center"
          >
            <Icon icon={"lucide:home"} className="size-8" />
            {navT("home")}
          </Link>
          <Link
            href={`/${locale}/courses`}
            className="flex flex-col gap-2 items-center justify-center"
          >
            <Icon icon={"lucide:book-open-check"} className="size-8" />
            {navT("courses")}
          </Link>
          <Link
            href={`/${locale}/institutes`}
            className="flex flex-col gap-2 items-center justify-center"
          >
            <Icon icon={"lucide:school"} className="size-8" />
            {navT("institutes")}
          </Link>
          <Link
            href={`/${locale}/destinations`}
            className="flex flex-col gap-2 items-center justify-center"
          >
            <Icon icon={"iconoir:globe"} className="size-8" />
            {navT("destinations")}
          </Link>
        </div>
      )}
    </header>
  );
}
