import SchoolBooking from "@/components/school-booking";
import {
  accommodationsV2,
  coursesV2,
  schoolsV2,
  transfersV2,
} from "@/lib/search-data";
import { type Locale } from "@/lib/data";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string; schoolId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function parseNumber(value: string | string[] | undefined): number | undefined {
  if (typeof value !== "string") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function parseNumberArray(value: string | string[] | undefined): number[] {
  if (typeof value !== "string") return [];

  return value
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => !Number.isNaN(item));
}

function parseString(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : "";
}

export default async function SchoolsPage({ params, searchParams }: Props) {
  const { locale, schoolId } = await params;
  const t = await getTranslations("schoolBooking");
  const schoolIdNumber = Number(schoolId);
  const school = schoolsV2.find((item) => item.id === schoolIdNumber);

  if (!school) {
    return null;
  }

  const courses = coursesV2.filter((course) => course.schoolId === school.id);
  const accommodations = accommodationsV2.filter(
    (item) => item.schoolId === school.id,
  );
  const transfers = transfersV2.filter((item) => item.schoolId === school.id);
  const parsedWeeks =
    parseNumber((await searchParams).weeks) ??
    parseNumber((await searchParams).duration_weeks) ??
    1;

  return (
    <SchoolBooking
      school={school}
      courses={courses}
      accommodations={accommodations}
      transfers={transfers}
      initial={{
        courseId: parseNumber((await searchParams).course_id),
        courseTypeId: parseNumber((await searchParams).course_type_id),
        startDate: parseString((await searchParams).start_date),
        weeks: parsedWeeks,
        residenceId: parseNumber((await searchParams).residence_id),
        residenceWeeks: parseNumber((await searchParams).residence_weeks),
        airportId: parseNumber((await searchParams).airport_id),
        accommodation: (await searchParams).accommodation === "1",
        airportPickup: (await searchParams).airport_pickup === "1",
        insurance: (await searchParams).insurance === "1",
        courseAddonIds: parseNumberArray((await searchParams).course_addon_ids),
        accommodationAddonIds: parseNumberArray(
          (await searchParams).accommodation_addon_ids,
        ),
      }}
      locale={locale as Locale}
      pageTitle={t("pageTitle")}
    />
  );
}
