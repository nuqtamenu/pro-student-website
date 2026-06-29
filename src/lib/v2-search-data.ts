import countriesData from "../../public/data/v3/countries.json";
import citiesData from "../../public/data/v3/cities.json";
import institutesData from "../../public/data/v3/institutes.json";
import schoolsData from "../../public/data/v3/schools.json";
import coursesData from "../../public/data/v3/courses.json";
import accommodationsData from "../../public/data/v3/accommodities.json";
import transfersData from "../../public/data/v3/transfers.json";
import courseCategoriesData from "../../public/data/v3/categories/courseCategories.json";
import {
  type Accommodation,
  type City,
  type Country,
  type Course,
  type Institute,
  type School,
  type Transfer,
  type Localized,
} from "./new_data";
import { tx, type Locale } from "./data";

export type SchoolSearchFilters = {
  search: string;
  countryId?: number;
  cityId?: number;
  courseTypeId?: number;
  durationWeeks?: number;
  startDate: string;
  accommodation: boolean;
  airportPickup: boolean;
  insurance: boolean;
};

type V3CourseCategory = {
  id: number;
  slug: string;
  categoryName: Localized;
  categoryDescription?: Localized;
  image?: string;
};

const toLocalized = (value?: Localized | null): Localized =>
  value ?? { en: "", ar: "" };

function toLegacyCountry(item: any): Country {
  return {
    id: item.id,
    name: toLocalized(item.countryName ?? item.name),
    description: toLocalized(item.countryDescription ?? item.description),
    slug: item.slug,
    image: item.image,
    currency: {
      currencyName:
        item.currency?.currencyName?.en ?? item.currency?.currencyName ?? "",
      currencyIcon: item.currency?.symbol ?? "",
      currencyCode: item.currency?.code ?? "",
    },
  } as Country;
}

function toLegacyCity(item: any): City {
  return {
    id: item.id,
    name: toLocalized(item.cityName ?? item.name),
    description: toLocalized(item.cityDescription ?? item.description),
    slug: item.slug,
    image: item.image,
    countryId: item.countryId,
  } as City;
}

function toLegacyInstitute(item: any): Institute {
  return {
    id: item.id,
    name: toLocalized(item.instituteName ?? item.name),
    description: toLocalized(item.instituteDescription ?? item.description),
    slug: item.slug,
    logo: item.logo,
    image: item.image,
    schools: [],
  } as Institute;
}

function toLegacySchool(item: any): School {
  return {
    id: item.id,
    name: toLocalized(item.schoolName ?? item.name),
    description: toLocalized(item.schoolDescription ?? item.description),
    slug: item.slug,
    image: item.image,
    fees: (item.fees ?? []).map((fee: any) => ({
      name: toLocalized(fee.feeName ?? fee.name),
      amount: fee.feeAmount ?? fee.amount ?? 0,
      optional: Boolean(fee.optional),
      frequency: (fee.feeFrequency ?? fee.frequency ?? "fixed") as any,
    })),
    countryId: item.countryId,
    cityId: item.cityId,
  } as School;
}

function toLegacyAccommodation(item: any): Accommodation {
  return {
    id: item.id,
    accommodationName: toLocalized(item.accommodationName),
    accommodationDescription: toLocalized(item.accommodationDescription),
    image: item.image ?? undefined,
    accommodationCategoryId: item.accommodationCategoryId ?? 0,
    note: toLocalized(item.note),
    minimumAge: item.minimumAge,
    durationWeeks: item.durationWeeks,
    accommodationDates: item.accommodationDates,
    schoolId: item.schoolId,
    price: item.price ?? 0,
    priceFrequency: (item.priceFrequency ?? "weekly") as any,
    location: item.location ?? null,
    commuteOptions: item.commuteOptions ?? null,
    accommodationPlans: (item.accommodationPlans ?? []).map((plan: any) => ({
      planName: toLocalized(plan.planName),
      amount: plan.amount ?? 0,
      frequency: (plan.frequency ?? "weekly") as any,
      optional: Boolean(plan.optional),
    })),
  } as Accommodation;
}

function toLegacyTransfer(item: any): Transfer {
  return {
    id: item.id,
    schoolId: item.schoolId,
    serviceName: toLocalized(item.transferName ?? item.serviceName),
    serviceNote: toLocalized(item.transferDescription ?? item.serviceNote),
    transferPackages: [
      {
        packageName: toLocalized(item.transferDescription ?? item.serviceName),
        transferOptions: [
          {
            optionName: toLocalized(item.transferName),
            pickupLocation: toLocalized(item.pickupLocation),
            amount: item.amount ?? 0,
            tripType: item.tripType ?? "oneWay",
          },
        ],
      },
    ],
  } as Transfer;
}

function toLegacyCourse(item: any, school?: School): Course {
  const coursePlans = (item.coursePlans ?? []).map((plan: any) => ({
    weekRange: plan.weekRange,
    price: plan.price ?? 0,
    frequency: (plan.priceFrequency ?? "weekly") as any,
  }));

  return {
    id: item.id,
    name: toLocalized(item.courseName),
    description: toLocalized(item.courseDescription),
    image: item.image,
    discount: item.discount ?? 0,
    instituteId: item.instituteId,
    schoolId: item.schoolId,
    cityId: school?.cityId ?? 0,
    countryId: school?.countryId ?? 0,
    programs: [
      {
        programName: toLocalized(item.courseName),
        description: toLocalized(item.courseDescription),
        image: item.image,
        courses: [
          {
            courseName: toLocalized(item.courseName),
            lessonsPerWeek: coursePlans[0]?.weekRange?.max ?? 0,
            discount: item.discount ?? 0,
            pricingTiers: coursePlans,
          },
        ],
        addOns: [],
      },
    ],
    courseCategoryId: item.courseCategoryId,
  } as Course & { courseCategoryId?: number } as Course;
}

export const countriesV2 = countriesData.map(toLegacyCountry) as Country[];
export const citiesV2 = citiesData.map(toLegacyCity) as City[];
export const institutesV2 = institutesData.map(
  toLegacyInstitute,
) as Institute[];
export const schoolsV2 = schoolsData.map(toLegacySchool) as School[];
export const accommodationsV2 = accommodationsData.map(
  toLegacyAccommodation,
) as Accommodation[];
export const transfersV2 = transfersData.map(toLegacyTransfer) as Transfer[];
export const courseCategoriesV3 = courseCategoriesData as V3CourseCategory[];

const schoolLookup = new Map(schoolsV2.map((school) => [school.id, school]));
export const coursesV2 = coursesData.map((item: any) =>
  toLegacyCourse(item, schoolLookup.get(item.schoolId)),
) as Course[];

export function getCitiesByCountry(countryId?: number): City[] {
  return typeof countryId === "number"
    ? citiesV2.filter((city) => city.countryId === countryId)
    : citiesV2;
}

export function getSchoolCourses(schoolId: number): Course[] {
  return coursesV2.filter((course) => course.schoolId === schoolId);
}

export function getSchoolInstituteName(
  schoolId: number,
  locale: Locale,
): string {
  const course = coursesV2.find((item) => item.schoolId === schoolId);
  const institute = course
    ? institutesV2.find((item) => item.id === course.instituteId)
    : undefined;

  return institute
    ? tx(institute.name, locale)
    : tx({ en: "Unknown Institute", ar: "معهد غير معروف" }, locale);
}

export function getSchoolTopCourseName(
  schoolId: number,
  locale: Locale,
): string {
  const course = getSchoolCourses(schoolId)[0];
  return course
    ? tx(course.name, locale)
    : tx({ en: "No course available", ar: "لا توجد دورات" }, locale);
}

export function getSchoolMinimumPrice(schoolId: number): number | undefined {
  const prices = getSchoolCourses(schoolId).flatMap((course) =>
    course.programs.flatMap((program) =>
      program.courses.flatMap((item) =>
        item.pricingTiers.map((tier) => tier.price),
      ),
    ),
  );

  return prices.length > 0 ? Math.min(...prices) : undefined;
}

export function schoolHasAccommodation(schoolId: number): boolean {
  return accommodationsV2.some((item) => item.schoolId === schoolId);
}

export function schoolHasTransfers(schoolId: number): boolean {
  return transfersV2.some((item) => item.schoolId === schoolId);
}

export function schoolHasCourseType(schoolId: number, courseTypeId?: number) {
  if (typeof courseTypeId !== "number") {
    return true;
  }

  return getSchoolCourses(schoolId).some(
    (course) =>
      (course as Course & { courseCategoryId?: number }).courseCategoryId ===
      courseTypeId,
  );
}

export function schoolHasInsurance(school: School): boolean {
  return school.fees.some(
    (fee) =>
      fee.name.en.toLowerCase() === "insurance" ||
      fee.name.ar.toLowerCase() === "التأمين",
  );
}

export function getCourseCategoryById(courseTypeId?: number) {
  return courseTypeId
    ? courseCategoriesV3.find((category) => category.id === courseTypeId)
    : undefined;
}

export function schoolMatchesDuration(
  schoolId: number,
  weeks: number,
): boolean {
  return getSchoolCourses(schoolId).some((course) =>
    course.programs.some((program) =>
      program.courses.some((item) =>
        item.pricingTiers.some((tier) => {
          const tierMin = tier.weekRange?.min ?? 1;
          const tierMax = tier.weekRange?.max ?? tierMin;
          return tierMin <= weeks && tierMax >= weeks;
        }),
      ),
    ),
  );
}

export function getCountryById(countryId?: number): Country | undefined {
  return countriesV2.find((country) => country.id === countryId);
}

export function getCityById(cityId?: number): City | undefined {
  return citiesV2.find((city) => city.id === cityId);
}
