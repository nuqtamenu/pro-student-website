"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslations } from "next-intl";
import { tx, type Locale } from "@/lib/data";
import {
  courseCategoriesV3,
  getCityById,
  getCountryById,
} from "../lib/search-data";
import {
  type AccommodationAddon,
  type Category,
  type Course,
  type CourseAddon,
  type School,
  type Accommodation,
  type Transfer,
} from "@/lib/v4-dsa";
import Image from "next/image";
import courseAddonsData from "../../public/data/v4/courseAddons.json";
import accommodationAddonsData from "../../public/data/v4/accommodationAddons.json";
import accommodationCategoriesData from "../../public/data/v4/categories.json";
import CourseSelectCard from "./course-select-card";
import CourseAddonSelectCard from "./course-addon-select-card";
import AccommodationSelectCard from "./accommodation-select-card";
import TransferSelectCard from "./transfer-select-card";

const weeksRange = Array.from({ length: 48 }, (_, index) => index + 1);

function formatPrice(value: number) {
  return `£${value.toFixed(0)}`;
}

export default function SchoolBooking({
  school,
  courses,
  accommodations,
  transfers,
  initial,
  locale,
  pageTitle,
}: {
  school: School;
  courses: Course[];
  accommodations: Accommodation[];
  transfers: Transfer[];
  initial: {
    courseId?: number;
    courseTypeId?: number;
    startDate?: string;
    weeks?: number;
    residenceId?: number;
    residenceWeeks?: number;
    airportId?: number;
    accommodation?: boolean;
    airportPickup?: boolean;
    insurance?: boolean;
    courseAddonIds?: number[];
    accommodationAddonIds?: number[];
  };
  locale: Locale;
  pageTitle?: string;
}) {
  const router = useRouter();
  const t = useTranslations("schoolBooking");
  const pathname = usePathname();
  const hasMounted = useRef(false);

  const availableCourses = useMemo(() => courses, [courses]);
  const availableCourseAddons = useMemo(() => {
    return (courseAddonsData as CourseAddon[]).filter(
      (addon): addon is CourseAddon =>
        addon.schoolId === school.id &&
        typeof addon.price === "number" &&
        Boolean(addon.addonName),
    );
  }, [school.id]);

  const resolvedCourseId =
    initial.courseId &&
    availableCourses.some((course) => course.id === initial.courseId)
      ? initial.courseId
      : availableCourses[0]?.id;
  const resolvedResidenceId =
    initial.residenceId &&
    accommodations.some((item) => item.id === initial.residenceId)
      ? initial.residenceId
      : accommodations[0]?.id;
  const resolvedAirportId =
    initial.airportId && transfers.some((item) => item.id === initial.airportId)
      ? initial.airportId
      : transfers[0]?.id;

  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>(
    resolvedCourseId,
  );
  const [startDate, setStartDate] = useState<string>(initial.startDate ?? "");
  const [weeks, setWeeks] = useState<number>(initial.weeks ?? 1);
  const [hasAccommodation, setHasAccommodation] = useState<boolean>(
    initial.accommodation ?? Boolean(initial.residenceId),
  );
  const [selectedResidenceId, setSelectedResidenceId] = useState<
    number | undefined
  >(resolvedResidenceId);
  const [selectedAccommodationTypeId, setSelectedAccommodationTypeId] =
    useState<number | "all">("all");
  const [selectedAccommodationAddonIds, setSelectedAccommodationAddonIds] =
    useState<number[]>(initial.accommodationAddonIds ?? []);
  const [residenceWeeks, setResidenceWeeks] = useState<number>(
    initial.residenceWeeks ?? initial.weeks ?? 1,
  );
  const [hasAirport, setHasAirport] = useState<boolean>(
    initial.airportPickup ?? Boolean(initial.airportId && resolvedAirportId),
  );
  const [selectedAirportId, setSelectedAirportId] = useState<
    number | undefined
  >(resolvedAirportId);
  const [hasInsurance, setHasInsurance] = useState<boolean>(
    !!initial.insurance,
  );
  const [selectedAddonIds, setSelectedAddonIds] = useState<number[]>(
    initial.courseAddonIds ?? [],
  );

  const country = getCountryById(school.countryId);
  const city = getCityById(school.cityId);

  const course = useMemo(
    () =>
      availableCourses.find((item) => item.id === selectedCourseId) ??
      availableCourses[0],
    [availableCourses, selectedCourseId],
  );

  const selectedResidence = useMemo(
    () => accommodations.find((item) => item.id === selectedResidenceId),
    [accommodations, selectedResidenceId],
  );

  const selectedAirport = useMemo(
    () => transfers.find((item) => item.id === selectedAirportId),
    [transfers, selectedAirportId],
  );

  const accommodationTypeOptions = useMemo(() => {
    return (accommodationCategoriesData as Category[]).filter(
      (category) => category.type === "accommodation",
    );
  }, []);

  const filteredAccommodations = useMemo(() => {
    if (selectedAccommodationTypeId === "all") {
      return accommodations;
    }

    return accommodations.filter(
      (item) => item.categoryId === selectedAccommodationTypeId,
    );
  }, [accommodations, selectedAccommodationTypeId]);

  const availableAccommodationAddons = useMemo(() => {
    if (!hasAccommodation || !selectedResidence?.categoryId) {
      return [];
    }

    return (accommodationAddonsData as AccommodationAddon[]).filter(
      (addon) =>
        addon.schoolId === school.id &&
        addon.categoryId === selectedResidence.categoryId &&
        typeof addon.amount === "number",
    );
  }, [hasAccommodation, school.id, selectedResidence]);

  const activeAccommodationAddonIds = useMemo(() => {
    const availableIds = new Set(
      availableAccommodationAddons.map((addon) => addon.id),
    );
    return selectedAccommodationAddonIds.filter((id) => availableIds.has(id));
  }, [availableAccommodationAddons, selectedAccommodationAddonIds]);

  const selectedAccommodationAddons = useMemo(
    () =>
      availableAccommodationAddons.filter((addon) =>
        activeAccommodationAddonIds.includes(addon.id),
      ),
    [activeAccommodationAddonIds, availableAccommodationAddons],
  );

  const accommodationAddonsPrice = useMemo(() => {
    return selectedAccommodationAddons.reduce(
      (sum, addon) => sum + addon.amount * (residenceWeeks || weeks),
      0,
    );
  }, [residenceWeeks, selectedAccommodationAddons, weeks]);

  const coursePrice = useMemo(() => {
    if (!course) return 0;
    const priceTier = course.coursePlans.find((plan) => {
      const min = plan.weekRange?.min ?? 1;
      const max = plan.weekRange?.max ?? min;
      return weeks >= min && weeks <= max;
    });

    return (priceTier?.price ?? course.coursePlans[0]?.price ?? 0) * weeks;
  }, [course, weeks]);

  const selectedCourseAddons = useMemo(
    () =>
      availableCourseAddons.filter((addon) =>
        selectedAddonIds.includes(addon.id),
      ),
    [availableCourseAddons, selectedAddonIds],
  );

  const courseAddonsPrice = useMemo(() => {
    return selectedCourseAddons.reduce(
      (sum, addon) => sum + addon.price * weeks,
      0,
    );
  }, [selectedCourseAddons, weeks]);

  const accommodationPrice = useMemo(() => {
    if (!selectedResidence || !hasAccommodation) return 0;
    const basePrice = selectedResidence.price ?? 0;
    return basePrice * (residenceWeeks || weeks);
  }, [selectedResidence, residenceWeeks, weeks, hasAccommodation]);

  const transferPrice = useMemo(() => {
    if (!selectedAirport || !hasAirport) return 0;
    return selectedAirport.amount ?? 0;
  }, [selectedAirport, hasAirport]);

  const insurancePrice = useMemo(() => {
    if (!hasInsurance) return 0;
    const insuranceFee = school.fees.find((fee) => {
      const name = fee.feeName?.en?.toLowerCase() ?? "";
      const arabicName = fee.feeName?.ar?.toLowerCase() ?? "";
      return name.includes("insurance") || arabicName.includes("التأمين");
    });
    return (insuranceFee?.feeAmount ?? 0) * weeks;
  }, [hasInsurance, school.fees, weeks]);

  const fixedFeesTotal = useMemo(() => {
    return school.fees
      .filter((fee) => fee.feeFrequency === "fixed")
      .reduce((sum, fee) => sum + fee.feeAmount, 0);
  }, [school.fees]);

  const subtotal = useMemo(() => {
    return (
      coursePrice +
      courseAddonsPrice +
      accommodationPrice +
      accommodationAddonsPrice +
      transferPrice +
      insurancePrice +
      fixedFeesTotal
    );
  }, [
    coursePrice,
    courseAddonsPrice,
    accommodationPrice,
    accommodationAddonsPrice,
    transferPrice,
    insurancePrice,
    fixedFeesTotal,
  ]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const params = new URLSearchParams();
    if (selectedCourseId) params.set("course_id", String(selectedCourseId));
    if (startDate) params.set("start_date", startDate);
    if (weeks) {
      params.set("weeks", String(weeks));
      params.set("duration_weeks", String(weeks));
    }
    if (hasAccommodation && selectedResidenceId)
      params.set("residence_id", String(selectedResidenceId));
    if (hasAccommodation && residenceWeeks)
      params.set("residence_weeks", String(residenceWeeks));
    if (hasAirport && selectedAirportId)
      params.set("airport_id", String(selectedAirportId));
    if (hasAccommodation) params.set("accommodation", "1");
    if (hasAirport) params.set("airport_pickup", "1");
    if (hasInsurance) params.set("insurance", "1");
    if (selectedAddonIds.length > 0) {
      params.set("course_addon_ids", selectedAddonIds.join(","));
    } else {
      params.delete("course_addon_ids");
    }
    if (activeAccommodationAddonIds.length > 0) {
      params.set(
        "accommodation_addon_ids",
        activeAccommodationAddonIds.join(","),
      );
    } else {
      params.delete("accommodation_addon_ids");
    }
    if (typeof initial.courseTypeId === "number") {
      params.set("course_type_id", String(initial.courseTypeId));
    }

    const query = params.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;
    const currentSearch =
      typeof window !== "undefined"
        ? window.location.search.replace(/^\?/, "")
        : "";
    if (query !== currentSearch) {
      router.replace(nextUrl, { scroll: false });
    }
  }, [
    selectedCourseId,
    startDate,
    weeks,
    hasAccommodation,
    selectedResidenceId,
    residenceWeeks,
    hasAirport,
    selectedAirportId,
    hasInsurance,
    selectedAddonIds,
    activeAccommodationAddonIds,
    initial.courseTypeId,
    pathname,
    router,
  ]);

  return (
    <div className="bg-linear-to-b from-dark-orange via-light-orange to-white w-full">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="rounded-4xl border border-white/40 bg-white/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="grid gap-6">
            <div className="space-y-6">
              <div className="flex flex-col gap-4 rounded-2xl border border-white/40 bg-white/70 p-5 shadow-sm sm:flex-row sm:items-center">
                <Image
                  src={`/images/schools/bayswater-english-school.png`}
                  alt={school.schoolName?.[locale] ?? t("school")}
                  width={200}
                  height={200}
                  className="h-28 w-28 rounded-2xl object-cover"
                />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-dark-orange">
                    {pageTitle ?? t("pageTitle")}
                  </p>
                  <h1 className="text-2xl font-bold text-gray-dark">
                    {tx(
                      school.schoolName ?? { en: "School", ar: "مدرسة" },
                      locale,
                    )}
                  </h1>
                  <p className="mt-1 text-sm text-gray-dark/70">
                    {city ? tx(city.cityName, locale) : ""},{" "}
                    {country ? tx(country.countryName, locale) : ""}
                  </p>
                  <p className="mt-2 text-sm text-gray-dark/75">
                    {tx(school.schoolDescription ?? { en: "", ar: "" }, locale)}
                  </p>
                </div>
              </div>

              {/* Booking configuration section: start date and study duration */}
              <section className="rounded-2xl border border-white/40 bg-white/70 p-5 shadow-sm">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-dark">
                      {t("courseStartDate")}
                    </label>
                    <div className="w-full" dir="ltr">
                      <DatePicker
                        selected={startDate ? new Date(startDate) : null}
                        onChange={(date: Date | null) =>
                          setStartDate(
                            date ? date.toISOString().split("T")[0] : "",
                          )
                        }
                        placeholderText={t("chooseStartDate")}
                        filterDate={(date) => date.getDay() === 1}
                        dateFormat="yyyy-MM-dd"
                        className="w-full rounded-2xl border border-white/40 bg-white/70 px-4 py-3 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white"
                        calendarStartDay={1}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-dark">
                      {t("studyDuration")}
                    </label>
                    <select
                      value={weeks}
                      onChange={(event) => setWeeks(Number(event.target.value))}
                      className="w-full rounded-2xl border border-white/40 bg-white/70 px-4 py-3 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white"
                    >
                      {weeksRange.map((week) => (
                        <option key={week} value={week}>
                          {week} week{week > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* Course selection section */}
              <section className="rounded-2xl border border-white/40 bg-white/70 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-dark">
                    {t("findCourses")}
                  </h2>
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                  {availableCourses.map((item) => {
                    const selected = item.id === selectedCourseId;
                    const selectedPlan = item.coursePlans.find((plan) => {
                      const min = plan.weekRange?.min ?? 1;
                      const max = plan.weekRange?.max ?? min;
                      return weeks >= min && weeks <= max;
                    });
                    const price =
                      (selectedPlan?.price ?? item.coursePlans[0]?.price ?? 0) *
                      weeks;
                    const lessons = selectedPlan?.lessonsPerWeek ?? 0;
                    const hours =
                      item.oneLessonMins && lessons
                        ? Math.round((lessons * item.oneLessonMins) / 60)
                        : 0;
                    const category = courseCategoriesV3.find(
                      (entry) => entry.id === item.categoryId,
                    );

                    return (
                      <CourseSelectCard
                        key={item.id}
                        course={item}
                        locale={locale}
                        selected={selected}
                        lessons={lessons}
                        hours={hours}
                        price={price}
                        categoryLabel={
                          category?.categoryName?.[locale] ?? t("course")
                        }
                        onSelect={() => setSelectedCourseId(item.id)}
                        formatPrice={formatPrice}
                      />
                    );
                  })}
                </div>
              </section>

              {/* Optional course addon selection */}
              <section className="rounded-2xl border border-white/40 bg-white/70 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-dark">
                    {t("courseAddons")}
                  </h2>
                </div>
                <p className="mt-2 text-sm text-gray-dark/70">
                  {t("courseAddonsDescription")}
                </p>
                {availableCourseAddons.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {availableCourseAddons.map((addon) => {
                      const selected = selectedAddonIds.includes(addon.id);

                      return (
                        <CourseAddonSelectCard
                          key={addon.id}
                          addon={addon}
                          locale={locale}
                          selected={selected}
                          weeks={weeks}
                          onToggle={() => {
                            setSelectedAddonIds((current) =>
                              current.includes(addon.id)
                                ? current.filter((id) => id !== addon.id)
                                : [...current, addon.id],
                            );
                          }}
                          formatPrice={formatPrice}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-gray-dark/70">
                    {t("noCourseAddons")}
                  </p>
                )}
              </section>

              {/* Accommodation selection section */}
              <section className="rounded-2xl border border-white/40 bg-white/70 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-dark">
                    {t("accommodation")}
                  </h2>
                  <label className="flex items-center gap-2 text-sm text-gray-dark">
                    <input
                      type="checkbox"
                      checked={hasAccommodation}
                      onChange={(event) => {
                        const checked = event.target.checked;
                        setHasAccommodation(checked);
                        if (!checked) {
                          setSelectedResidenceId(undefined);
                          setSelectedAccommodationAddonIds([]);
                        } else if (!selectedResidenceId && accommodations[0]) {
                          setSelectedResidenceId(accommodations[0].id);
                        }
                      }}
                      className="h-4 w-4 accent-dark-orange"
                    />
                    {t("includeAccommodation")}
                  </label>
                </div>

                {hasAccommodation ? (
                  <div className="mt-4 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-dark">
                          {t("accommodationDuration")}
                        </label>
                        <select
                          value={residenceWeeks}
                          onChange={(event) =>
                            setResidenceWeeks(Number(event.target.value))
                          }
                          className="w-full rounded-2xl border border-white/40 bg-white/70 px-4 py-3 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white"
                        >
                          {weeksRange.map((week) => (
                            <option key={week} value={week}>
                              {t("weekCount", { count: week })}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-dark">
                          {t("accommodationType")}
                        </label>
                        <select
                          value={selectedAccommodationTypeId}
                          onChange={(event) => {
                            const nextValue = event.target.value;
                            const nextTypeId =
                              nextValue === "all" ? "all" : Number(nextValue);
                            const nextMatches =
                              nextTypeId === "all"
                                ? accommodations
                                : accommodations.filter(
                                    (item) => item.categoryId === nextTypeId,
                                  );

                            setSelectedAccommodationTypeId(nextTypeId);

                            if (
                              !selectedResidenceId ||
                              !nextMatches.some(
                                (item) => item.id === selectedResidenceId,
                              )
                            ) {
                              setSelectedResidenceId(nextMatches[0]?.id);
                            }
                          }}
                          className="w-full rounded-2xl border border-white/40 bg-white/70 px-4 py-3 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white"
                        >
                          <option value="all">
                            {t("allAccommodationTypes")}
                          </option>
                          {accommodationTypeOptions.map((category) => (
                            <option key={category.id} value={category.id}>
                              {tx(category.categoryName, locale)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {filteredAccommodations.length > 0 ? (
                      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {filteredAccommodations.map((item) => {
                          const selected = item.id === selectedResidenceId;
                          const basePrice = item.price ?? 0;
                          const totalPrice =
                            basePrice * (residenceWeeks || weeks);

                          return (
                            <AccommodationSelectCard
                              key={item.id}
                              accommodation={item}
                              locale={locale}
                              selected={selected}
                              price={totalPrice}
                              weeks={residenceWeeks || weeks}
                              onSelect={() => setSelectedResidenceId(item.id)}
                              formatPrice={formatPrice}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <p className="rounded-2xl border border-dashed border-white/40 bg-white/70 p-4 text-sm text-gray-dark/70">
                        {t("noAccommodationOptions")}
                      </p>
                    )}

                    {hasAccommodation && selectedResidence ? (
                      <div className="rounded-2xl border border-white/40 bg-orange-50/40 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <h3 className="text-base font-semibold text-gray-dark">
                              {t("accommodationAddons")}
                            </h3>
                            {availableAccommodationAddons.length > 0 && (
                              <p className="mt-1 text-sm text-gray-dark/70">
                                {t("accommodationAddonsDescription")}
                              </p>
                            )}
                          </div>
                        </div>

                        {availableAccommodationAddons.length > 0 ? (
                          <div className="mt-4 space-y-3">
                            {availableAccommodationAddons.map((addon) => {
                              const selected =
                                activeAccommodationAddonIds.includes(addon.id);
                              const addonPrice =
                                addon.amount * (residenceWeeks || weeks);

                              return (
                                <label
                                  key={addon.id}
                                  className={`flex cursor-pointer flex-col gap-3 rounded-2xl border p-4 transition ${selected ? "border-dark-orange bg-white" : "border-white/40 bg-white/70"}`}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3">
                                      <input
                                        type="checkbox"
                                        checked={selected}
                                        onChange={() => {
                                          setSelectedAccommodationAddonIds(
                                            (current) =>
                                              current.includes(addon.id)
                                                ? current.filter(
                                                    (id) => id !== addon.id,
                                                  )
                                                : [...current, addon.id],
                                          );
                                        }}
                                        className="mt-1 h-4 w-4 accent-dark-orange"
                                      />
                                      <div>
                                        <h4 className="font-semibold text-gray-dark">
                                          {tx(addon.addonName, locale)}
                                        </h4>
                                        {addon.duration ? (
                                          <p className="mt-1 text-sm text-gray-dark/70">
                                            {t("from")}:{" "}
                                            {new Date(
                                              addon.duration.from,
                                            ).toLocaleDateString(
                                              locale === "ar"
                                                ? "ar-SA"
                                                : "en-GB",
                                            )}{" "}
                                            · {t("to")}:{" "}
                                            {new Date(
                                              addon.duration.to,
                                            ).toLocaleDateString(
                                              locale === "ar"
                                                ? "ar-SA"
                                                : "en-GB",
                                            )}
                                          </p>
                                        ) : null}
                                        {addon.location ? (
                                          <p className="mt-1 text-sm text-gray-dark/70">
                                            {t("location")}:{" "}
                                            {tx(addon.location, locale)}
                                          </p>
                                        ) : null}
                                        {addon.note ? (
                                          <p className="mt-1 text-sm text-gray-dark/70">
                                            {tx(addon.note, locale)}
                                          </p>
                                        ) : null}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-semibold text-gray-dark">
                                        {formatPrice(addonPrice)}
                                      </p>
                                      <p className="text-xs text-gray-dark/60">
                                        {t("forWeeks", {
                                          count: residenceWeeks || weeks,
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="mt-4 text-sm text-gray-dark/70">
                            {t("noAccommodationAddons")}
                          </p>
                        )}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </section>

              {/* Transfer selection section */}
              <section className="rounded-2xl border border-white/40 bg-white/70 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-dark">
                    {t("airportPickup")}
                  </h2>
                  <label className="flex items-center gap-2 text-sm text-gray-dark">
                    <input
                      type="checkbox"
                      checked={hasAirport}
                      onChange={(event) => {
                        setHasAirport(event.target.checked);
                        if (!event.target.checked) {
                          setSelectedAirportId(undefined);
                        } else if (!selectedAirportId && transfers[0]) {
                          setSelectedAirportId(transfers[0].id);
                        }
                      }}
                      className="h-4 w-4 accent-dark-orange"
                    />
                    {t("includeAirportTransfer")}
                  </label>
                </div>
                {hasAirport ? (
                  <div className="mt-4 space-y-3 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {transfers.map((item) => {
                      const selected = item.id === selectedAirportId;
                      const amount = item.amount ?? 0;

                      return (
                        <TransferSelectCard
                          key={item.id}
                          transfer={item}
                          locale={locale}
                          selected={selected}
                          amount={amount}
                          onSelect={() => setSelectedAirportId(item.id)}
                          formatPrice={formatPrice}
                        />
                      );
                    })}
                  </div>
                ) : null}
              </section>

              {/* Insurance toggle section */}
              <section className="rounded-2xl border border-white/40 bg-white/70 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-dark">
                    {t("insurance")}
                  </h2>
                  <label className="flex items-center gap-2 text-sm text-gray-dark">
                    <input
                      type="checkbox"
                      checked={hasInsurance}
                      onChange={(event) =>
                        setHasInsurance(event.target.checked)
                      }
                      className="h-4 w-4 accent-dark-orange"
                    />
                    {t("addInsurance")}
                  </label>
                </div>
              </section>
            </div>

            {/* Quote summary sidebar */}
            <aside className="rounded-4xl border border-white/40 bg-white/80 p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-gray-dark">
                {t("summary")}
              </h2>
              <div className="mt-4 space-y-3 text-sm text-gray-dark/80">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span>{t("course")}</span>
                  <span>{formatPrice(coursePrice)}</span>
                </div>
                {selectedCourseAddons.length > 0 ? (
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <span>{t("courseAddons")}</span>
                    <span>{formatPrice(courseAddonsPrice)}</span>
                  </div>
                ) : null}
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span>{t("accommodation")}</span>
                  <span>{formatPrice(accommodationPrice)}</span>
                </div>
                {selectedAccommodationAddons.length > 0 ? (
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <span>{t("accommodationAddons")}</span>
                    <span>{formatPrice(accommodationAddonsPrice)}</span>
                  </div>
                ) : null}
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span>{t("airportPickup")}</span>
                  <span>{formatPrice(transferPrice)}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span>{t("insurance")}</span>
                  <span>{formatPrice(insurancePrice)}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span>{t("fixedFees")}</span>
                  <span>{formatPrice(fixedFeesTotal)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <h3 className="font-semibold text-gray-dark">
                  {t("fixedFeeSection")}
                </h3>
                {school.fees
                  .filter((fee) => fee.feeFrequency === "fixed")
                  .map((fee) => (
                    <div
                      key={fee.feeName?.en}
                      className="rounded-2xl border border-white/40 bg-white/70 p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-gray-dark">
                          {fee.feeName?.[locale] ?? fee.feeName?.en}
                        </span>
                        <span className="text-sm font-semibold text-gray-dark">
                          {formatPrice(fee.feeAmount)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-dark/70">
                        {fee.feeName?.[locale] ?? ""}
                      </p>
                    </div>
                  ))}
              </div>
              <div className="mt-5 rounded-2xl bg-dark-orange/10 p-4">
                <div className="flex items-center justify-between text-lg font-semibold text-gray-dark">
                  <span>{t("subtotal")}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>

              <Link
                href={{
                  pathname: `/${locale}/quotation`,
                  query: {
                    ...(typeof window !== "undefined"
                      ? Object.fromEntries(
                          new URLSearchParams(window.location.search),
                        )
                      : {}),
                    schoolId: String(school.id),
                  },
                }}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-dark-orange px-5 py-3 text-sm font-semibold text-white transition hover:bg-red"
              >
                {t("getQuote")}
              </Link>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
