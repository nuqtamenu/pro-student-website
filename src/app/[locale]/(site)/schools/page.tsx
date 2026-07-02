import { notFound } from "next/navigation";
import SchoolsSearchPage from "@/components/schools-search-page";
import { routing } from "@/i18n/routing";
import { type Locale } from "@/lib/data";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
};

function parseNumber(value: string | string[] | undefined): number | undefined {
  if (typeof value !== "string") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function parseString(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : "";
}

export default async function InstitutesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "ar" | "en")) {
    notFound();
  }

  const awaitedParams = await searchParams;

  const initialFilters = {
    search: parseString(awaitedParams.search),
    countryId: parseNumber(awaitedParams.country_id),
    cityId: parseNumber(awaitedParams.city_id),
    courseTypeId: parseNumber(awaitedParams.course_type_id),
    durationWeeks:
      parseNumber(awaitedParams.duration_weeks) ??
      parseNumber(awaitedParams.duration_min),
    startDate: parseString(awaitedParams.start_date),
    accommodation: awaitedParams.accommodation === "1",
    airportPickup: awaitedParams.airport_pickup === "1",
    insurance: awaitedParams.insurance === "1",
  };

  return (
    <SchoolsSearchPage
      initialFilters={initialFilters}
      locale={locale as Locale}
    />
  );
}
