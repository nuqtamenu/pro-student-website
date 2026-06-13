import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { LanguageSwitcher } from "./language-switcher";

export async function Header() {
  const t = await getTranslations("header");

  return (
    <header className="relative z-30">
      <div className="bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Left cluster */}
          <div className="flex items-center gap-3 sm:gap-5">
            <a
              href="tel:0580666525"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-dark transition hover:text-dark-orange"
            >
              <Icon icon="lucide:phone" width={16} className="text-dark-orange" />
              <span className="hidden sm:inline">{t("phone")}</span>
            </a>
            <span className="hidden h-4 w-px bg-black/10 sm:block" />
            <LanguageSwitcher />
            <span className="hidden h-4 w-px bg-black/10 sm:block" />
            <button
              type="button"
              className="hidden items-center gap-1.5 text-sm font-medium text-gray-dark transition hover:text-dark-orange sm:flex"
            >
              <Icon icon="lucide:map-pin" width={16} className="text-dark-orange" />
              {t("officeLocation")}
            </button>
          </div>

          {/* Center logo */}
          <div className="absolute left-1/2 top-3 -translate-x-1/2">
            <Image
              src="/logo.png"
              alt="Pro Student"
              width={56}
              height={56}
              className="h-12 w-12 object-contain"
              priority
            />
          </div>

          {/* Right cluster */}
          <button
            type="button"
            className="flex items-center gap-2 text-sm font-medium text-gray-dark transition hover:text-dark-orange"
          >
            <span className="hidden sm:inline">{t("menu")}</span>
            <Icon icon="lucide:menu" width={22} />
          </button>
        </div>
      </div>

      {/* Tagline strip */}
      <div className="bg-gray-dark">
        <p className="mx-auto max-w-7xl px-4 py-1.5 text-center text-xs font-medium tracking-wide text-white sm:text-sm">
          {t("tagline")}
        </p>
      </div>
    </header>
  );
}
