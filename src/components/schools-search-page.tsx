"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { type SchoolSearchFilters } from "@/lib/v2-search-data";
import { type Locale } from "@/lib/data";
import { SearchSidebar } from "./search-sidebar";
import { SearchResults } from "./search-results";

type Props = {
  initialFilters: SchoolSearchFilters;
  locale: Locale;
};

export default function SchoolsSearchPage({ initialFilters, locale }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [filters, setFilters] = useState<SchoolSearchFilters>(initialFilters);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const params = new URLSearchParams();

    if (filters.search) params.set("search", filters.search);
    if (filters.countryId) params.set("country_id", String(filters.countryId));
    if (filters.cityId) params.set("city_id", String(filters.cityId));
    if (typeof filters.courseTypeId === "number") {
      params.set("course_type_id", String(filters.courseTypeId));
    }
    if (typeof filters.durationWeeks === "number") {
      params.set("duration_weeks", String(filters.durationWeeks));
    }
    if (filters.startDate) params.set("start_date", filters.startDate);
    if (filters.accommodation) params.set("accommodation", "1");
    if (filters.airportPickup) params.set("airport_pickup", "1");
    if (filters.insurance) params.set("insurance", "1");

    const query = params.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;
    const currentSearch =
      typeof window !== "undefined"
        ? window.location.search.replace(/^\?/, "")
        : "";

    if (query !== currentSearch) {
      router.replace(nextUrl, { scroll: false });
    }
  }, [filters, pathname, router]);

  return (
    <div className="bg-linear-to-b from-dark-orange via-light-orange to-white w-full">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 xl:grid-cols-[360px_1fr]">
          <SearchSidebar
            filters={filters}
            setFilters={setFilters}
            locale={locale}
          />
          <SearchResults filters={filters} locale={locale} />
        </div>
      </div>
    </div>
  );
}
