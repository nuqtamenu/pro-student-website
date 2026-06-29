import SchoolBooking from "@/components/school-booking";
import {
  accommodationsV2,
  coursesV2,
  getCityById,
  getCountryById,
  schoolsV2,
  transfersV2,
} from "@/lib/v2-search-data";
import { type Locale } from "@/lib/data";

type Props = {
  params: Promise<{ locale: string; schoolId: string }>;
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

export default async function SchoolsPage({ params, searchParams }: Props) {
  const { locale, schoolId } = await params;
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

  return (
    <SchoolBooking
      school={school}
      courses={courses}
      accommodations={accommodations}
      transfers={transfers}
      initial={{
        courseId: parseNumber(searchParams.course_id),
        startDate: parseString(searchParams.start_date),
        weeks: parseNumber(searchParams.weeks) ?? 1,
        residenceId: parseNumber(searchParams.residence_id),
        residenceWeeks: parseNumber(searchParams.residence_weeks),
        airportId: parseNumber(searchParams.airport_id),
        insurance: searchParams.insurance === "1",
      }}
      locale={locale as Locale}
    />
  );
}
