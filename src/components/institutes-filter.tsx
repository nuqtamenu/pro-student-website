"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@iconify/react";
import { cities, schools, tx, type Locale } from "@/lib/data";
import InstituteCard from "./institute-card";

export function InstitutesFilter() {
  const t = useTranslations("institutes");
  const locale = useLocale() as Locale;
  const [cityId, setCityId] = useState<number | "all">("all");
  const [search, setSearch] = useState("");

  const filteredSchools = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return schools.filter((school) => {
      const matchesCity = cityId === "all" || school.cityId === cityId;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        tx(school.name, locale).toLowerCase().includes(normalizedSearch);
      return matchesCity && matchesSearch;
    });
  }, [cityId, locale, search]);

  return (
    <section className="bg-linear-to-b from-dark-orange via-light-orange to-white w-full py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="glass rounded-4xl border border-white/20 bg-white/20 p-6 shadow-2xl backdrop-blur-xl">
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-dark/70">
                {t("label")}
              </p>
              <h1 className="mt-3 max-w-2xl text-3xl font-semibold text-gray-dark sm:text-4xl">
                {t("title")}
              </h1>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-dark">
                  {t("filterCity")}
                </span>
                <div className="relative">
                  <select
                    value={cityId === "all" ? "all" : cityId}
                    onChange={(event) => {
                      const value = event.target.value;
                      setCityId(value === "all" ? "all" : Number(value));
                    }}
                    className="w-full appearance-none rounded-xl border border-white/40 bg-white/70 px-4 py-3 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white"
                  >
                    <option value="all">{t("allCities")}</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {tx(city.name, locale)}
                      </option>
                    ))}
                  </select>
                  <Icon
                    icon="lucide:chevron-down"
                    width={18}
                    className="pointer-events-none absolute inset-e-3 top-1/2 -translate-y-1/2 text-gray-light"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-dark">
                  {t("searchByName")}
                </span>
                <div className="relative">
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={t("searchByName")}
                    className="w-full rounded-xl border border-white/40 bg-white/70 px-4 py-3 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white"
                  />
                  <Icon
                    icon="lucide:search"
                    width={18}
                    className="pointer-events-none absolute inset-e-3 top-1/2 -translate-y-1/2 text-gray-light"
                  />
                </div>
              </label>
            </div>
          </div>
        </div>

        {filteredSchools.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {filteredSchools.map((school) => (
              <InstituteCard
                key={school.id}
                name={tx(school.name, locale)}
                description={tx(school.description, locale)}
                image={school.image || "school-placeholder.jpg"}
                cta={t("explore")}
                locale={locale}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-4xl border border-white/30 bg-white/80 p-10 text-center shadow-xl shadow-black/5 backdrop-blur-xl">
            <p className="text-xl font-semibold text-gray-dark">
              {t("noResults")}
            </p>
            <p className="mt-3 text-sm text-gray-dark/75">
              {t("noResultsDescription")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
