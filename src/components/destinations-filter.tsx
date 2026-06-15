"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@iconify/react";
import { Carousel } from "./carousel";
import DestinationCard from "./destination-card";
import { cities, countries, tx, type Locale } from "@/lib/data";

export function DestinationsFilter() {
  const t = useTranslations("destinations");
  const locale = useLocale() as Locale;
  const [countryId, setCountryId] = useState<number | "all">("all");
  const [search, setSearch] = useState("");

  const filteredCountries = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return countries
      .filter((country) => countryId === "all" || country.id === countryId)
      .map((country) => {
        const filteredCities = cities.filter((city) => {
          const matchesCountry = city.countryId === country.id;
          const matchesSearch =
            normalizedSearch.length === 0 ||
            tx(city.name, locale).toLowerCase().includes(normalizedSearch);
          return matchesCountry && matchesSearch;
        });

        return { country, cities: filteredCities };
      })
      .filter((entry) => entry.cities.length > 0);
  }, [countryId, locale, search]);

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
                  {t("filterCountry")}
                </span>
                <div className="relative">
                  <select
                    value={countryId === "all" ? "all" : countryId}
                    onChange={(event) => {
                      const value = event.target.value;
                      setCountryId(value === "all" ? "all" : Number(value));
                    }}
                    className="w-full appearance-none rounded-xl border border-white/40 bg-white/70 px-4 py-3 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white"
                  >
                    <option value="all">{t("allCountries")}</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {tx(country.name, locale)}
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

        {filteredCountries.length > 0 ? (
          <div className="mt-10 space-y-14">
            {filteredCountries.map(({ country, cities }) => (
              <section
                key={country.id}
                className="rounded-4xl bg-white/80 p-6 shadow-xl shadow-black/5 backdrop-blur-xl"
              >
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-dark/70">
                      {t("label")}
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-gray-dark">
                      {tx(country.name, locale)}
                    </h2>
                  </div>
                  <span className="rounded-full bg-dark-orange px-4 py-2 text-sm font-semibold text-white shadow-sm">
                    {cities.length} {t("cities")}
                  </span>
                </div>

                <Carousel
                  slideClassName="basis-[78%] sm:basis-1/2 lg:basis-1/4"
                  slideGapClass="gap-6"
                >
                  {cities.map((city) => (
                    <DestinationCard
                      key={city.id}
                      image={
                        city?.image
                          ? `/images/destinations/cities/${city.image}`
                          : `/images/destinations/cities/city-placeholder.jpg`
                      }
                      alt={tx(city.name, locale)}
                      name={tx(city.name, locale)}
                      labelCount={13}
                      lableText={t("schools")}
                      locale={locale}
                    />
                  ))}
                </Carousel>
              </section>
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
