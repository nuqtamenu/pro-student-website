"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
  coursesV2,
} from "@/lib/v2-search-data";
import { tx, type Locale } from "@/lib/data";
import { type Course, type School } from "@/lib/new_data";

import CourseCard from "./course-card";

function isMatchSearch(
  course: Course,
  school: School,
  search: string,
  locale: Locale,
) {
  const normalizedSearch = search.trim().toLowerCase();
  if (!normalizedSearch) return true;

  const category =
    getCourseCategoryById(
      (course as Course & { courseCategoryId?: number }).courseCategoryId,
    )?.categoryName[locale] ?? "";

  return [
    tx(course.name ?? { en: "", ar: "" }, locale),
    tx(course.description ?? { en: "", ar: "" }, locale),
    tx(school.name ?? { en: "", ar: "" }, locale),
    category,
    getCityById(school.cityId)?.name[locale] ?? "",
  ].some((value) => value.toLowerCase().includes(normalizedSearch));
}

function getCoursePrice(course: Course): number {
  const prices = course.programs.flatMap((program) =>
    program.courses.flatMap((programCourse) =>
      programCourse.pricingTiers.map((tier) => tier.price),
    ),
  );

  return prices.length > 0 ? Math.min(...prices) : 0;
}

function getCourseLessons(course: Course): number {
  return course.programs
    .flatMap((program) =>
      program.courses.map((programCourse) => programCourse.lessonsPerWeek ?? 0),
    )
    .reduce((sum, value) => sum + value, 0);
}

function courseMatchesDuration(course: Course, weeks: number): boolean {
  return course.programs.some((program) =>
    program.courses.some((programCourse) =>
      programCourse.pricingTiers.some((tier) => {
        const min = tier.weekRange?.min ?? 1;
        const max = tier.weekRange?.max ?? min;
        return min <= weeks && weeks <= max;
      }),
    ),
  );
}

export function SearchResults({
  filters,
  locale,
}: {
  filters: SchoolSearchFilters;
  locale: Locale;
}) {
  const t = useTranslations("institutes");
  const router = useRouter();

  const filteredCourses = useMemo(() => {
    return coursesV2.filter((course) => {
      const school = schoolsV2.find((item) => item.id === course.schoolId);
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
        (course as Course & { courseCategoryId?: number }).courseCategoryId !==
          filters.courseTypeId
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

      <div className="grid gap-6 xl:grid-cols-2">
        {filteredCourses.map((course) => {
          const school = schoolsV2.find((item) => item.id === course.schoolId);
          const category =
            getCourseCategoryById(
              (course as Course & { courseCategoryId?: number })
                .courseCategoryId,
            )?.categoryName[locale] ?? "";
          const lessons = getCourseLessons(course);
          const week = filters.durationWeeks ?? 1;
          const hours = lessons > 0 ? lessons * 2 : 0;
          const price = getCoursePrice(course);
          const schoolId = school?.id ?? course.schoolId;
          const instituteName = institutesV2.find(
            (item) => item.id === course.instituteId,
          )
            ? tx(
                institutesV2.find((item) => item.id === course.instituteId)!
                  .name,
                locale,
              )
            : "";
          const location = [
            school ? (getCityById(school.cityId)?.name[locale] ?? "") : "",
            school
              ? (getCountryById(school.countryId)?.name[locale] ?? "")
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
              name={tx(course.name, locale)}
              discount={course.discount ?? 0}
              lessons={lessons}
              week={week}
              price={price}
              category={category}
              hours={hours}
              requiredLevel=""
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
