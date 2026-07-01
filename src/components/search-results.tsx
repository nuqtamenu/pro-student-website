"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";
import {
  getCityById,
  getCountryById,
  getCourseCategoryById,
  institutesV2,
  schoolHasAccommodation,
  schoolHasInsurance,
  schoolHasTransfers,
  type SchoolSearchFilters,
  schoolsV2,
} from "../lib/search-data";
import coursesData from "../../public/data/v4/courses.json";
import { tx, type Locale } from "@/lib/data";
import { type Course, type School, type Institute } from "@/lib/v4-dsa";

import CourseCard from "./course-card";

const coursesV4 = coursesData as Course[];
type LegacySchool = School;

function isMatchSearch(
  course: Course,
  school: LegacySchool,
  search: string,
  locale: Locale,
) {
  const normalizedSearch = search.trim().toLowerCase();
  if (!normalizedSearch) return true;

  const category =
    getCourseCategoryById(course.categoryId)?.categoryName[locale] ?? "";

  return [
    tx(course.courseName, locale),
    tx(course.courseDescription ?? { en: "", ar: "" }, locale),
    tx(school.schoolName ?? { en: "", ar: "" }, locale),
    category,
    getCityById(school.cityId)?.cityName[locale] ?? "",
  ].some((value) => value.toLowerCase().includes(normalizedSearch));
}

function selectPricingTier(course: Course, weeks?: number) {
  const tiers = course.coursePlans ?? [];

  if (typeof weeks === "number") {
    const found = tiers.find((tier) => {
      const min = tier.weekRange?.min ?? 1;
      const max = tier.weekRange?.max ?? min;
      return min <= weeks && weeks <= max;
    });
    return found ?? tiers[0];
  }

  return tiers[0];
}

function courseMatchesDuration(course: Course, weeks: number): boolean {
  if (typeof weeks !== "number") return true;

  return (course.coursePlans ?? []).some((tier) => {
    const min = tier.weekRange?.min ?? 1;
    const max = tier.weekRange?.max ?? min;
    return min <= weeks && weeks <= max;
  });
}

export function SearchResults({
  filters,
  locale,
}: {
  filters: SchoolSearchFilters;
  locale: Locale;
}) {
  const t = useTranslations("institutes");
  const tc = useTranslations("coursesPage");
  const router = useRouter();

  const filteredCourses = useMemo(() => {
    return coursesV4.filter((course) => {
      const school = schoolsV2.find(
        (item: School) => item.id === course.schoolId,
      );
      if (!school) {
        return false;
      }

      if (filters.countryId && school.countryId !== filters.countryId) {
        return false;
      }

      if (filters.cityId && school.cityId !== filters.cityId) {
        return false;
      }

      if (filters.accommodation && !schoolHasAccommodation(school.id)) {
        return false;
      }

      if (filters.airportPickup && !schoolHasTransfers(school.id)) {
        return false;
      }

      if (
        typeof filters.courseTypeId === "number" &&
        course.categoryId !== filters.courseTypeId
      ) {
        return false;
      }

      if (filters.insurance && !schoolHasInsurance(school)) {
        return false;
      }

      if (typeof filters.durationWeeks === "number") {
        if (!courseMatchesDuration(course, filters.durationWeeks)) {
          return false;
        }
      }

      return isMatchSearch(course, school, filters.search, locale);
    });
  }, [filters, locale]);

  return (
    <div className="space-y-6">
      <div className="p-4">
        <p className="text-base text-gray-dark/75 font-bold">
          {t("resultsCount", { count: filteredCourses.length })}
        </p>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="mx-auto max-w-2xl rounded-xl border border-white/20 p-6 text-center bg-white/60">
          <h3 className="text-lg font-semibold text-gray-dark">
            {tc("noCoursesFound")}
          </h3>
          <p className="mt-2 text-sm text-gray-dark/75">
            {tc("noCoursesFoundDescription")}
          </p>
          <p className="mt-4 text-sm text-gray-dark/75">
            {tc("contactSupport")}
          </p>
          <div className="mt-3 flex items-center justify-center gap-6">
            <a
              href="tel:+966580666525"
              className="text-dark-orange font-semibold flex items-center gap-2"
              aria-label="Call +966580666525"
            >
              <Icon
                icon="lucide:phone"
                width={18}
                className="text-dark-orange"
              />
              <span dir="ltr">+966580666525</span>
            </a>
            <a
              href="https://wa.me/966580666525"
              target="_blank"
              rel="noreferrer"
              className="text-dark-orange font-semibold flex items-center gap-2"
              aria-label="WhatsApp +966580666525"
            >
              <Icon
                icon="mdi:whatsapp"
                width={18}
                className="text-dark-orange"
              />
              <span dir="ltr">+966580666525</span>
            </a>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-3">
        {filteredCourses.map((course) => {
          const school = schoolsV2.find(
            (item: School) => item.id === course.schoolId,
          );
          const category =
            getCourseCategoryById(course.categoryId)?.categoryName[locale] ??
            "";
          const selectedTier = selectPricingTier(course, filters.durationWeeks);
          const lessons = selectedTier?.lessonsPerWeek ?? 0;
          const hours =
            course?.oneLessonMins && lessons
              ? Math.round((lessons * course.oneLessonMins) / 60)
              : 0;

          const price = selectedTier?.price ?? 0;
          const requiredLevel = course.requiredLevel
            ? tx(course.requiredLevel, locale)
            : "";
          const schoolId = school?.id ?? course.schoolId;
          const instituteName = institutesV2.find(
            (item: Institute) => item.id === course.instituteId,
          )
            ? tx(
                institutesV2.find(
                  (item: Institute) => item.id === course.instituteId,
                )!.instituteName,
                locale,
              )
            : "";
          const location = [
            school ? (getCityById(school.cityId)?.cityName[locale] ?? "") : "",
            school
              ? (getCountryById(school.countryId)?.countryName[locale] ?? "")
              : "",
          ]
            .filter(Boolean)
            .join(" • ");

          const handleApply = () => {
            const params = new URLSearchParams();
            if (filters.search) params.set("search", filters.search);
            if (filters.countryId)
              params.set("country_id", String(filters.countryId));
            if (filters.cityId) params.set("city_id", String(filters.cityId));
            if (typeof filters.courseTypeId === "number") {
              params.set("course_type_id", String(filters.courseTypeId));
            }
            if (typeof filters.durationWeeks === "number") {
              params.set("weeks", String(filters.durationWeeks));
              params.set("duration_weeks", String(filters.durationWeeks));
            }
            if (filters.startDate) params.set("start_date", filters.startDate);
            if (filters.accommodation) params.set("accommodation", "1");
            if (filters.airportPickup) params.set("airport_pickup", "1");
            if (filters.insurance) params.set("insurance", "1");
            params.set("course_id", String(course.id));

            const query = params.toString();
            router.push(
              `/${locale}/schools/${schoolId}${query ? `?${query}` : ""}`,
            );
          };

          return (
            <CourseCard
              key={course.id}
              image={"course-placeholder.png"}
              // image={course.image ?? "course-placeholder.png"}
              name={tx(course.courseName, locale)}
              discount={course.discount ?? 0}
              lessons={lessons}
              price={price}
              category={category}
              hours={hours}
              requiredLevel={requiredLevel}
              instituteName={instituteName}
              location={location}
              onApply={handleApply}
            />
          );
        })}
      </div>
    </div>
  );
}
