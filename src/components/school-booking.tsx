"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslations } from "next-intl";
import { tx, type Locale } from "@/lib/data";
import {
  courseCategoriesV3,
  getCityById,
  getCountryById,
} from "@/lib/v2-search-data";
import {
  type Course,
  type School,
  type Accommodation,
  type Transfer,
} from "@/lib/new_data";
import Image from "next/image";

const weeksRange = Array.from({ length: 48 }, (_, index) => index + 1);

function formatPrice(value: number) {
  return `$${value.toFixed(0)}`;
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
  };
  locale: Locale;
  pageTitle?: string;
}) {
  const router = useRouter();
  const t = useTranslations("schoolBooking");
  const pathname = usePathname();
  const hasMounted = useRef(false);

  const availableCourses = useMemo(() => courses, [courses]);

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

  const coursePrice = useMemo(() => {
    if (!course) return 0;
    const priceTier = course.programs
      .flatMap((program) => program.courses)
      .flatMap((programCourse) => programCourse.pricingTiers)
      .find((tier) => {
        const min = tier.weekRange?.min ?? 1;
        const max = tier.weekRange?.max ?? min;
        return weeks >= min && weeks <= max;
      });

    return (priceTier?.price ?? 0) * weeks;
  }, [course, weeks]);

  const accommodationPrice = useMemo(() => {
    if (!selectedResidence || !hasAccommodation) return 0;
    const firstPlan = selectedResidence.accommodationPlans?.[0];
    const basePrice = firstPlan?.amount ?? selectedResidence.price ?? 0;
    return basePrice * (residenceWeeks || weeks);
  }, [selectedResidence, residenceWeeks, weeks, hasAccommodation]);

  const transferPrice = useMemo(() => {
    if (!selectedAirport || !hasAirport) return 0;
    const firstPackage = selectedAirport.transferPackages?.[0];
    return firstPackage?.transferOptions?.[0]?.amount ?? 0;
  }, [selectedAirport, hasAirport]);

  const insurancePrice = useMemo(() => {
    if (!hasInsurance) return 0;
    const insuranceFee = school.fees.find((fee) => {
      const name = fee.name?.en?.toLowerCase() ?? "";
      const arabicName = fee.name?.ar?.toLowerCase() ?? "";
      return name.includes("insurance") || arabicName.includes("التأمين");
    });
    return (insuranceFee?.amount ?? 0) * weeks;
  }, [hasInsurance, school.fees, weeks]);

  const fixedFeesTotal = useMemo(() => {
    return school.fees
      .filter((fee) => fee.frequency === "fixed")
      .reduce((sum, fee) => sum + fee.amount, 0);
  }, [school.fees]);

  const subtotal = useMemo(() => {
    return (
      coursePrice +
      accommodationPrice +
      transferPrice +
      insurancePrice +
      fixedFeesTotal
    );
  }, [
    coursePrice,
    accommodationPrice,
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
                  alt={school.name?.[locale] ?? t("school")}
                  width={200}
                  height={200}
                  className="h-28 w-28 rounded-2xl object-cover"
                />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-dark-orange">
                    {pageTitle ?? t("pageTitle")}
                  </p>
                  <h1 className="text-2xl font-bold text-gray-dark">
                    {tx(school.name ?? { en: "School", ar: "مدرسة" }, locale)}
                  </h1>
                  <p className="mt-1 text-sm text-gray-dark/70">
                    {city ? tx(city.name, locale) : ""},{" "}
                    {country ? tx(country.name, locale) : ""}
                  </p>
                  <p className="mt-2 text-sm text-gray-dark/75">
                    {tx(school.description ?? { en: "", ar: "" }, locale)}
                  </p>
                </div>
              </div>

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

              <section className="rounded-2xl border border-white/40 bg-white/70 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-dark">
                    {t("findCourses")}
                  </h2>
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  {availableCourses.map((item) => {
                    const selected = item.id === selectedCourseId;
                    const price =
                      (item.programs
                        ?.flatMap((program) => program.courses)
                        .flatMap((programCourse) => programCourse.pricingTiers)
                        .find((tier) => {
                          const min = tier.weekRange?.min ?? 1;
                          const max = tier.weekRange?.max ?? min;
                          return weeks >= min && weeks <= max;
                        })?.price ?? 0) * weeks;
                    const lessons =
                      item.programs
                        .flatMap((program) => program.courses)
                        .reduce(
                          (sum, programCourse) =>
                            sum + (programCourse.lessonsPerWeek ?? 0),
                          0,
                        ) || 0;
                    const category = courseCategoriesV3.find(
                      (entry) =>
                        entry.id ===
                        (item as Course & { courseCategoryId?: number })
                          .courseCategoryId,
                    );

                    return (
                      <label
                        key={item.id}
                        className={`flex cursor-pointer flex-col overflow-hidden rounded-2xl border shadow-sm transition ${selected ? "border-dark-orange bg-orange-50" : "border-white/40 bg-white/70"}`}
                      >
                        <div className="relative h-36">
                          <Image
                            src={`/images/courses/course-placeholder.png`}
                            // src={`/images/courses/${item.image ?? "course-placeholder.png"}`}
                            alt={item.name?.[locale] ?? t("course")}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between p-4">
                          <div>
                            <p className="text-sm text-gray-light">
                              {category?.categoryName?.[locale] ?? t("course")}
                            </p>
                            <h3 className="mt-1 text-lg font-semibold text-gray-dark">
                              {item.name?.[locale] ?? item.name}
                            </h3>
                            <p className="mt-2 text-sm text-gray-dark/70">
                              {item.description?.[locale] ?? ""}
                            </p>
                          </div>
                          <div className="mt-4 space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-dark/70">
                              <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white px-2 py-1">
                                <Icon
                                  icon="mdi:teach"
                                  width={16}
                                  className="text-dark-orange"
                                />
                                {t("lessons", { count: lessons })}
                              </div>
                              <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white px-2 py-1">
                                <Icon
                                  icon="mdi:clock-outline"
                                  width={16}
                                  className="text-dark-orange"
                                />
                                {t("weekCount", { count: weeks })}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="course"
                                  checked={selected}
                                  onChange={() => setSelectedCourseId(item.id)}
                                  className="h-4 w-4 accent-dark-orange"
                                />
                                <span className="text-sm text-gray-dark/80">
                                  {t("select")}
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-gray-dark">
                                  {formatPrice(price)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </section>

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
                        setHasAccommodation(event.target.checked);
                        if (!event.target.checked) {
                          setSelectedResidenceId(undefined);
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
                    <div className="mx-auto max-w-xl">
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

                    <div className="space-y-3">
                      {accommodations.map((item) => {
                        const selected = item.id === selectedResidenceId;
                        const basePrice =
                          item.accommodationPlans?.[0]?.amount ??
                          item.price ??
                          0;
                        const totalPrice =
                          basePrice * (residenceWeeks || weeks);

                        return (
                          <label
                            key={item.id}
                            className={`flex cursor-pointer flex-col gap-3 rounded-2xl border p-4 transition ${selected ? "border-dark-orange bg-orange-50" : "border-white/40 bg-white/70"}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <input
                                  type="radio"
                                  name="accommodation"
                                  checked={selected}
                                  onChange={() =>
                                    setSelectedResidenceId(item.id)
                                  }
                                  className="mt-1 h-4 w-4 accent-dark-orange"
                                />
                                <div>
                                  <h3 className="font-semibold text-gray-dark">
                                    {tx(item.accommodationName, locale)}
                                  </h3>
                                  {item.accommodationDescription ? (
                                    <p className="mt-1 text-sm text-gray-dark/70">
                                      {tx(
                                        item.accommodationDescription,
                                        locale,
                                      )}
                                    </p>
                                  ) : null}
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {typeof item.minimumAge === "number" ? (
                                      <span className="rounded-full border border-white/40 bg-white px-2 py-1 text-xs text-gray-dark/70">
                                        {t("minAge", { age: item.minimumAge })}
                                      </span>
                                    ) : null}
                                    <span className="rounded-full border border-white/40 bg-white px-2 py-1 text-xs text-gray-dark/70">
                                      {t(
                                        `frequency.${item.priceFrequency ?? "weekly"}`,
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-gray-dark">
                                  {formatPrice(totalPrice)}
                                </p>
                                <p className="text-xs text-gray-dark/60">
                                  {t("forWeeks", {
                                    count: residenceWeeks || weeks,
                                  })}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-3 rounded-2xl border border-white/40 bg-white/70 p-3">
                              {item.location && item.location.length > 0 ? (
                                <div>
                                  <p className="text-sm font-semibold text-gray-dark">
                                    {t("location")}
                                  </p>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {item.location.map(
                                      (location, locationIndex) => (
                                        <span
                                          key={`${item.id}-location-${locationIndex}`}
                                          className="rounded-full border border-white/40 bg-orange-50 px-2 py-1 text-xs text-gray-dark"
                                        >
                                          {location.name?.[locale] ??
                                            location.name?.en}
                                        </span>
                                      ),
                                    )}
                                  </div>
                                </div>
                              ) : null}

                              {item.commuteOptions &&
                              item.commuteOptions.length > 0 ? (
                                <div>
                                  <p className="text-sm font-semibold text-gray-dark">
                                    {t("commute")}
                                  </p>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {item.commuteOptions.map(
                                      (option, optionIndex) => (
                                        <span
                                          key={`${item.id}-commute-${optionIndex}`}
                                          className="rounded-full border border-white/40 bg-white px-2 py-1 text-xs text-gray-dark"
                                        >
                                          {option.transport?.mode?.[locale] ??
                                            option.transport?.mode?.en}{" "}
                                          · {option.travelTime.min}-
                                          {option.travelTime.max}{" "}
                                          {option.travelTime.unit}
                                        </span>
                                      ),
                                    )}
                                  </div>
                                </div>
                              ) : null}

                              {/* Hidded the */}
                              {/* <div>
                                <p className="text-sm font-semibold text-gray-dark">
                                  {t("plans")}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {item.accommodationPlans.map(
                                    (plan, planIndex) => (
                                      <div
                                        key={`${item.id}-plan-${planIndex}`}
                                        className="rounded-xl border border-white/40 bg-white p-3 text-sm"
                                      >
                                        <p className="font-medium text-gray-dark">
                                          {tx(plan.planName, locale)}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-dark/70">
                                          {formatPrice(plan.amount)} /{" "}
                                          {plan.frequency}
                                        </p>
                                        <p className="mt-1 text-xs font-semibold text-dark-orange">
                                          {formatPrice(
                                            plan.amount *
                                              (residenceWeeks || weeks),
                                          )}
                                        </p>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div> */}

                              {item.note ? (
                                <p className="text-sm text-gray-dark/70">
                                  {tx(item.note, locale)}
                                </p>
                              ) : null}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </section>

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
                  <div className="mt-4 space-y-3">
                    {transfers.map((item) => {
                      const selected = item.id === selectedAirportId;
                      const firstOption =
                        item.transferPackages?.[0]?.transferOptions?.[0];
                      const amount = firstOption?.amount ?? 0;
                      const pickupLocation = firstOption?.pickupLocation;
                      const tripType = firstOption?.tripType;

                      return (
                        <label
                          key={item.id}
                          className={`flex cursor-pointer flex-col gap-3 rounded-2xl border p-4 transition ${selected ? "border-dark-orange bg-orange-50" : "border-white/40 bg-white/70"}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <input
                                type="radio"
                                name="transfer"
                                checked={selected}
                                onChange={() => setSelectedAirportId(item.id)}
                                className="mt-1 h-4 w-4 accent-dark-orange"
                              />
                              <div>
                                <h3 className="font-semibold text-gray-dark">
                                  {tx(item.serviceName, locale)}
                                </h3>
                                {item.serviceNote ? (
                                  <p className="mt-1 text-sm text-gray-dark/70">
                                    {tx(item.serviceNote, locale)}
                                  </p>
                                ) : null}
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {pickupLocation ? (
                                    <span className="rounded-full border border-white/40 bg-white px-2 py-1 text-xs text-gray-dark/70">
                                      {t("pickup", {
                                        location: tx(pickupLocation, locale),
                                      })}
                                    </span>
                                  ) : null}
                                  <span className="rounded-full border border-white/40 bg-white px-2 py-1 text-xs text-gray-dark/70">
                                    {tripType === "roundTrip"
                                      ? t("roundTrip")
                                      : t("oneWay")}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-dark">
                                {formatPrice(amount)}
                              </p>
                            </div>
                          </div>

                          {/* <div className="space-y-2 rounded-2xl border border-white/40 bg-blue-600/70 p-3">
                            {item.transferPackages?.map((pkg, pkgIndex) => (
                              <div key={`${item.id}-package-${pkgIndex}`}>
                                <p className="text-sm font-semibold text-gray-dark">
                                  {tx(pkg.packageName, locale)}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {pkg.transferOptions.map(
                                    (option, optionIndex) => (
                                      <div
                                        key={`${item.id}-option-${pkgIndex}-${optionIndex}`}
                                        className="rounded-xl border border-white/40 bg-white p-3 text-sm"
                                      >
                                        <p className="font-medium text-gray-dark">
                                          {tx(option.optionName, locale)}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-dark/70">
                                          Pickup:{" "}
                                          {tx(option.pickupLocation, locale)}
                                        </p>
                                        <p className="mt-1 text-xs font-semibold text-dark-orange">
                                          {formatPrice(option.amount)}
                                        </p>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            ))}
                          </div> */}
                        </label>
                      );
                    })}
                  </div>
                ) : null}
              </section>

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

            <aside className="rounded-4xl border border-white/40 bg-white/80 p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-gray-dark">
                {t("summary")}
              </h2>
              <div className="mt-4 space-y-3 text-sm text-gray-dark/80">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span>{t("course")}</span>
                  <span>{formatPrice(coursePrice)}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span>{t("accommodation")}</span>
                  <span>{formatPrice(accommodationPrice)}</span>
                </div>
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
                  .filter((fee) => fee.frequency === "fixed")
                  .map((fee) => (
                    <div
                      key={fee.name?.en}
                      className="rounded-2xl border border-white/40 bg-white/70 p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-gray-dark">
                          {fee.name?.[locale] ?? fee.name?.en}
                        </span>
                        <span className="text-sm font-semibold text-gray-dark">
                          {formatPrice(fee.amount)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-dark/70">
                        {fee.name?.[locale] ?? ""}
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
