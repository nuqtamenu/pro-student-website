import regionsData from "../../public/data/regions.json";
// import countriesData from "../../public/data/countries.json";
// import citiesData from "../../public/data/cities.json";
// import schoolsData from "../../public/data/schools.json";
import countriesData from "../../public/data/_countries.json";
import citiesData from "../../public/data/_cities.json";
import schoolsData from "../../public/data/_schools.json";
import coursesData from "../../public/data/courses.json";

export type Locale = "en" | "ar";

export type Localized = { en: string; ar: string };

export type Region = {
  id: string;
  name: Localized;
};

export type Country = {
  id: number;
  name: Localized;
  description: Localized;
  slug: string;
  image: string;
};

export type City = {
  id: number;
  name: Localized;
  description: Localized;
  slug: string;
  image: string;
  countryId: number;
};

export type School = {
  id: number;
  cityId: number;
  name: Localized;
  description: Localized;
  slug: string;
  logo?: string;
  image: string;
};

export type Course = {
  id: string;
  name: Localized;
  provider: Localized;
  description: Localized;
  image: string;
  discount: string;
  schoolIds: string[];
};

export const regions = regionsData as Region[];
export const countries = countriesData as Country[];
export const cities = citiesData as City[];
export const schools = schoolsData as School[];
export const courses = coursesData as Course[];

/** Resolve a localized field for the given locale. */
export function tx(value: Localized, locale: Locale): string {
  return value[locale] ?? value.en;
}

/** Schools located in a given city (destination). */
export function schoolsByCity(cityId: number): School[] {
  return schools.filter((s) => s.cityId === cityId);
}

/** Courses available at a given school. */
export function coursesBySchool(schoolId: string): Course[] {
  return courses.filter((c) => c.schoolIds.includes(schoolId));
}
