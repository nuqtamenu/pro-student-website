import QuotationPage from "@/components/quotation-page";
import { type Locale } from "@/lib/data";
import {
  accommodationsV2,
  coursesV2,
  schoolsV2,
  transfersV2,
} from "@/lib/v2-search-data";
import { getTranslations } from "next-intl/server";

function parseNumber(value: string | string[] | undefined): number | undefined {
  if (typeof value !== "string") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function parseBoolean(value: string | string[] | undefined): boolean {
  return value === "1";
}

export default async function QuotationRoute({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("schoolBooking");
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

  const coursePrice = course
    ? (course.programs
        .flatMap((program) => program.courses)
        .flatMap((programCourse) => programCourse.pricingTiers)
        .find((tier) => {
          const min = tier.weekRange?.min ?? 1;
          const max = tier.weekRange?.max ?? min;
          return weeks >= min && weeks <= max;
        })?.price ?? 0) * weeks
    : 0;

  const accommodationPrice =
    hasAccommodation && accommodation
      ? (accommodation.accommodationPlans?.[0]?.amount ??
          accommodation.price ??
          0) * residenceWeeks
      : 0;

  const transferPrice =
    hasAirport && transfer
      ? (transfer.transferPackages?.[0]?.transferOptions?.[0]?.amount ?? 0)
      : 0;
  const insuranceFee = school.fees.find((fee) => {
    const name = fee.name?.en?.toLowerCase() ?? "";
    const arabicName = fee.name?.ar?.toLowerCase() ?? "";
    return name.includes("insurance") || arabicName.includes("التأمين");
  });
  const insurancePrice = hasInsurance ? (insuranceFee?.amount ?? 0) * weeks : 0;
  const fixedFeesTotal = school.fees
    .filter((fee) => fee.frequency === "fixed")
    .reduce((sum, fee) => sum + fee.amount, 0);
  const subtotal =
    coursePrice +
    accommodationPrice +
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
        hasAccommodation,
        hasAirport,
        hasInsurance,
      }}
      fees={school.fees}
      coursePrice={coursePrice}
      accommodationPrice={accommodationPrice}
      transferPrice={transferPrice}
      insurancePrice={insurancePrice}
      fixedFeesTotal={fixedFeesTotal}
      subtotal={subtotal}
      pageTitle={t("pageTitle")}
    />
  );
}
