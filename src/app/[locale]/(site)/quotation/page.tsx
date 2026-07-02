import QuotationPage from "@/components/quotation-page";
import { type Locale } from "@/lib/data";
import {
  accommodationsV2,
  coursesV2,
  schoolsV2,
  transfersV2,
} from "@/lib/search-data";
import courseAddonsData from "../../../../../public/data/v4/courseAddons.json";
import accommodationAddonsData from "../../../../../public/data/v4/accommodationAddons.json";
import { type AccommodationAddon, type CourseAddon } from "@/lib/v4-dsa";

function parseNumber(value: string | string[] | undefined): number | undefined {
  if (typeof value !== "string") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function parseBoolean(value: string | string[] | undefined): boolean {
  return value === "1";
}

function parseNumberArray(value: string | string[] | undefined): number[] {
  if (typeof value !== "string") return [];

  return value
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => !Number.isNaN(item));
}

export default async function QuotationRoute({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  const schoolId = parseNumber(resolvedSearchParams.schoolId);
  const school = schoolId
    ? schoolsV2.find((item) => item.id === schoolId)
    : schoolsV2[0];

  if (!school) {
    return null;
  }

  const selectedCourseId = parseNumber(resolvedSearchParams.course_id);
  const selectedResidenceId = parseNumber(resolvedSearchParams.residence_id);
  const selectedAirportId = parseNumber(resolvedSearchParams.airport_id);
  const selectedAddonIds = parseNumberArray(
    resolvedSearchParams.course_addon_ids,
  );
  const selectedAccommodationAddonIds = parseNumberArray(
    resolvedSearchParams.accommodation_addon_ids,
  );
  const weeks = parseNumber(resolvedSearchParams.weeks) ?? 1;
  const residenceWeeks =
    parseNumber(resolvedSearchParams.residence_weeks) ?? weeks;
  const hasAccommodation = parseBoolean(resolvedSearchParams.accommodation);
  const hasAirport = parseBoolean(resolvedSearchParams.airport_pickup);
  const hasInsurance = parseBoolean(resolvedSearchParams.insurance);

  const course =
    coursesV2.find((item) => item.id === selectedCourseId) ??
    coursesV2.find((item) => item.schoolId === school.id);
  const accommodation = accommodationsV2.find(
    (item) => item.id === selectedResidenceId,
  );
  const transfer = transfersV2.find((item) => item.id === selectedAirportId);
  const courseAddons = (courseAddonsData as CourseAddon[]).filter(
    (addon) =>
      addon.schoolId === school.id &&
      selectedAddonIds.includes(addon.id) &&
      typeof addon.price === "number",
  );
  const accommodationAddons = (
    accommodationAddonsData as AccommodationAddon[]
  ).filter(
    (addon) =>
      addon.schoolId === school.id &&
      selectedAccommodationAddonIds.includes(addon.id) &&
      typeof addon.amount === "number",
  );

  const coursePrice = course
    ? (course.coursePlans.find((plan) => {
        const min = plan.weekRange?.min ?? 1;
        const max = plan.weekRange?.max ?? min;
        return weeks >= min && weeks <= max;
      })?.price ??
        course.coursePlans[0]?.price ??
        0) * weeks
    : 0;

  const accommodationPrice =
    hasAccommodation && accommodation
      ? (accommodation.price ?? 0) * residenceWeeks
      : 0;
  const accommodationAddonsPrice = accommodationAddons.reduce(
    (sum, addon) => sum + addon.amount * residenceWeeks,
    0,
  );

  const transferPrice = hasAirport && transfer ? (transfer.amount ?? 0) : 0;
  const courseAddonsPrice = courseAddons.reduce(
    (sum, addon) => sum + addon.price * weeks,
    0,
  );
  const insuranceFee = school.fees.find((fee) => {
    const name = fee.feeName?.en?.toLowerCase() ?? "";
    const arabicName = fee.feeName?.ar?.toLowerCase() ?? "";
    return name.includes("insurance") || arabicName.includes("التأمين");
  });
  const insurancePrice = hasInsurance
    ? (insuranceFee?.feeAmount ?? 0) * weeks
    : 0;
  const fixedFeesTotal = school.fees
    .filter((fee) => fee.feeFrequency === "fixed")
    .reduce((sum, fee) => sum + fee.feeAmount, 0);
  const subtotal =
    coursePrice +
    courseAddonsPrice +
    accommodationPrice +
    accommodationAddonsPrice +
    transferPrice +
    insurancePrice +
    fixedFeesTotal;

  return (
    <QuotationPage
      school={school}
      course={course}
      accommodation={accommodation}
      transfer={transfer}
      locale={locale as Locale}
      initial={{
        weeks,
        residenceWeeks,
        startDate: resolvedSearchParams.start_date as string | undefined,
        accommodationStartDate: resolvedSearchParams.start_date as
          | string
          | undefined,
        accommodationEndDate: (() => {
          const start = resolvedSearchParams.start_date as string | undefined;
          if (!start) return undefined;
          const date = new Date(start);
          date.setDate(date.getDate() + residenceWeeks * 7);
          return date.toISOString().slice(0, 10);
        })(),
        hasAccommodation,
        hasAirport,
        hasInsurance,
      }}
      fees={school.fees}
      courseAddons={courseAddons}
      coursePrice={coursePrice}
      courseAddonsPrice={courseAddonsPrice}
      accommodationAddons={accommodationAddons}
      accommodationAddonsPrice={accommodationAddonsPrice}
      accommodationPrice={accommodationPrice}
      transferPrice={transferPrice}
      insurancePrice={insurancePrice}
      fixedFeesTotal={fixedFeesTotal}
      subtotal={subtotal}
    />
  );
}
