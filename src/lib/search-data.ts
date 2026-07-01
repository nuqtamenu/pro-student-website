import countriesData from "../../public/data/v4/countries.json";
import citiesData from "../../public/data/v4/cities.json";
import institutesData from "../../public/data/v4/institutes.json";
import schoolsData from "../../public/data/v4/schools.json";
import coursesData from "../../public/data/v4/courses.json";
import accommodationsData from "../../public/data/v4/accommoditation.json";
import transfersData from "../../public/data/v4/transfers.json";
import courseCategoriesData from "../../public/data/v4/categories.json";
import {
  type Accommodation,
  type Category,
  type City,
  type Country,
  type Course,
  type Institute,
  type School,
  type SchoolFee,
  type Transfer,
} from "./v4-dsa";
import { tx, type Locale as AppLocale } from "./data";

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

const countries = countriesData as Country[];
const cities = citiesData as City[];
const institutes = institutesData as Institute[];
const schools = schoolsData as School[];
const courses = coursesData as Course[];
const accommodations = accommodationsData as Accommodation[];
const transfers = transfersData as Transfer[];
const courseCategories = (courseCategoriesData as Category[]).filter(
  (category) => category.type === "course",
);

export const countriesV2 = countries;
export const citiesV2 = cities;
export const institutesV2 = institutes;
export const schoolsV2 = schools;
export const coursesV2 = courses;
export const accommodationsV2 = accommodations;
export const transfersV2 = transfers;
export const courseCategoriesV3 = courseCategories;

export function getCitiesByCountry(countryId?: number): City[] {
  return typeof countryId === "number"
    ? cities.filter((city) => city.countryId === countryId)
    : cities;
}

export function getCountryById(countryId?: number): Country | undefined {
  return countries.find((country) => country.id === countryId);
}

export function getCityById(cityId?: number): City | undefined {
  return cities.find((city) => city.id === cityId);
}

export function getCourseCategoryById(courseTypeId?: number) {
  return courseTypeId
    ? courseCategories.find((category) => category.id === courseTypeId)
    : undefined;
}

export function getSchoolCourses(schoolId: number): Course[] {
  return courses.filter((course) => course.schoolId === schoolId);
}

export function getSchoolInstituteName(
  schoolId: number,
  locale: AppLocale,
): string {
  const school = schools.find((item) => item.id === schoolId);
  const institute = school
    ? institutes.find((item) => item.id === school.instituteId)
    : undefined;

  return institute
    ? tx(institute.instituteName, locale)
    : tx({ en: "Unknown Institute", ar: "معهد غير معروف" }, locale);
}

export function getSchoolTopCourseName(
  schoolId: number,
  locale: AppLocale,
): string {
  const course = getSchoolCourses(schoolId)[0];
  return course
    ? tx(course.courseName, locale)
    : tx({ en: "No course available", ar: "لا توجد دورات" }, locale);
}

export function getSchoolMinimumPrice(schoolId: number): number | undefined {
  const prices = getSchoolCourses(schoolId).flatMap((course) =>
    course.coursePlans.map((plan) => plan.price),
  );
  return prices.length > 0 ? Math.min(...prices) : undefined;
}

export function schoolHasAccommodation(schoolId: number): boolean {
  return accommodations.some((item) => item.schoolId === schoolId);
}

export function schoolHasTransfers(schoolId: number): boolean {
  return transfers.some((item) => item.schoolId === schoolId);
}

export function schoolHasInsurance(school: School): boolean {
  return school.fees.some((fee) => {
    const name = fee.feeName?.en?.toLowerCase() ?? "";
    const arabicName = fee.feeName?.ar?.toLowerCase() ?? "";
    return name === "insurance" || arabicName === "التأمين";
  });
}

export function schoolHasCourseType(schoolId: number, courseTypeId?: number) {
  if (typeof courseTypeId !== "number") {
    return true;
  }

  return getSchoolCourses(schoolId).some(
    (course) => course.categoryId === courseTypeId,
  );
}

export function schoolMatchesDuration(
  schoolId: number,
  weeks: number,
): boolean {
  return getSchoolCourses(schoolId).some((course) =>
    course.coursePlans.some((tier) => {
      const min = tier.weekRange?.min ?? 1;
      const max = tier.weekRange?.max ?? min;
      return min <= weeks && weeks <= max;
    }),
  );
}

export {
  countries,
  cities,
  institutes,
  schools,
  courses,
  accommodations,
  transfers,
  courseCategories,
};
