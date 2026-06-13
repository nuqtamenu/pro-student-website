"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Icon } from "@iconify/react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function switchTo(next: "en" | "ar") {
    router.replace(pathname, { locale: next });
    setOpen(false);
  }

  const options: { code: "ar" | "en"; label: string }[] = [
    { code: "ar", label: "AR" },
    { code: "en", label: "EN" },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-gray-dark transition hover:text-dark-orange"
      >
        <Icon icon="lucide:globe" width={16} />
        <span>{locale.toUpperCase()}</span>
        <Icon icon="lucide:chevron-down" width={14} />
      </button>
      {open && (
        <div className="absolute end-0 z-50 mt-1 w-24 overflow-hidden rounded-md border border-black/10 bg-white shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.code}
              type="button"
              onClick={() => switchTo(opt.code)}
              className={`block w-full px-3 py-2 text-start text-sm transition hover:bg-light-orange/20 ${
                locale === opt.code
                  ? "font-bold text-dark-orange"
                  : "text-gray-dark"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
