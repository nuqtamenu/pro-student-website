"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import CourseCard from "./course-card";
import { categories, courses, tx, type Locale } from "@/lib/data";

export function CoursesFilter() {
  const t = useTranslations("coursesPage");
  const locale = useLocale() as Locale;
  const [categoryId, setCategoryId] = useState<number | "all">("all");
  const [requiredLevel, setRequiredLevel] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"default" | "high" | "low">(
    "default",
  );

  const requirementOptions = useMemo(() => {
    const values = new Set<string>();
    courses.forEach((course) => {
      if (course.requiredLevel) {
        values.add(tx(course.requiredLevel, locale));
      }
    });
    return ["all", ...Array.from(values).sort()];
  }, [locale]);

  const filteredCourses = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return courses
      .filter((course) => {
        const matchesCategory =
          categoryId === "all" || course.category === categoryId;
        const courseLevel = course.requiredLevel
          ? tx(course.requiredLevel, locale)
          : "";
        const matchesLevel =
          requiredLevel === "all" || courseLevel === requiredLevel;
        const matchesSearch =
          normalizedSearch.length === 0 ||
          tx(course.name, locale).toLowerCase().includes(normalizedSearch);

        return matchesCategory && matchesLevel && matchesSearch;
      })
      .sort((a, b) => {
        const getPrice = (course: (typeof courses)[number]) => {
          return course.discount
            ? course.price - (course.price * course.discount) / 100
            : course.price;
        };

        if (sortOrder === "high") {
          return getPrice(b) - getPrice(a);
        }
        if (sortOrder === "low") {
          return getPrice(a) - getPrice(b);
        }
        return 0;
      });
  }, [categoryId, locale, requiredLevel, search, sortOrder]);

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((item) => item.id === categoryId);
    return category ? tx(category.name, locale) : "";
  };

  return (
    <section className="bg-linear-to-b from-dark-orange via-light-orange to-white w-full py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="glass rounded-4xl border border-white/20 bg-white/20 p-6 shadow-2xl backdrop-blur-xl">
          <div className="grid gap-6 lg:grid-cols-[1.5fr_2fr] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-dark/70">
                {t("filterLabel")}
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-gray-dark sm:text-4xl">
                {t("filterTitle")}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-dark/75">
                {t("filterDescription")}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-dark">
                  {t("category")}
                </span>
                <div className="relative">
                  <select
                    value={categoryId === "all" ? "all" : categoryId}
                    onChange={(event) => {
                      const value = event.target.value;
                      setCategoryId(value === "all" ? "all" : Number(value));
                    }}
                    className="w-full appearance-none rounded-xl border border-white/40 bg-white/70 px-4 py-3 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white"
                  >
                    <option value="all">{t("allCategories")}</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {tx(category.name, locale)}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-dark">
                  {t("search")}
                </span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={t("searchPlaceholder")}
                  className="w-full rounded-xl border border-white/40 bg-white/70 px-4 py-3 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-dark">
                  {t("sortPrice")}
                </span>
                <div className="relative">
                  <select
                    value={sortOrder}
                    onChange={(event) =>
                      setSortOrder(
                        event.target.value as "default" | "high" | "low",
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-white/40 bg-white/70 px-4 py-3 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white"
                  >
                    <option value="default">{t("sortDefault")}</option>
                    <option value="high">{t("sortHigh")}</option>
                    <option value="low">{t("sortLow")}</option>
                  </select>
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-dark">
                  {t("requiredLevel")}
                </span>
                <div className="relative">
                  <select
                    value={requiredLevel}
                    onChange={(event) => setRequiredLevel(event.target.value)}
                    className="w-full appearance-none rounded-xl border border-white/40 bg-white/70 px-4 py-3 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white"
                  >
                    <option value="all">{t("allLevels")}</option>
                    {requirementOptions.map((level) =>
                      level === "all" ? null : (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-gray-dark">
            {filteredCourses.length} {t("results")}
          </p>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                name={tx(course.name, locale)}
                image={course.image || "course-placeholder.png"}
                category={getCategoryName(course.category)}
                discount={course.discount}
                lessons={10}
                week={5}
                hours={3}
                requiredLevel={
                  course.requiredLevel ? tx(course.requiredLevel, locale) : ""
                }
                price={course.price}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-4xl border border-white/30 bg-white/80 p-10 text-center shadow-xl shadow-black/5 backdrop-blur-xl">
            <p className="text-xl font-semibold text-gray-dark">
              {t("noCoursesFound")}
            </p>
            <p className="mt-3 text-sm text-gray-dark/75">
              {t("noCoursesFoundDescription")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
