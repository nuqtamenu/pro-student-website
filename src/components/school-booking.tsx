"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { tx, type Locale } from "@/lib/data";
import { getCityById, getCountryById } from "@/lib/v2-search-data";
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
}: {
  school: School;
  courses: Course[];
  accommodations: Accommodation[];
  transfers: Transfer[];
  initial: {
    courseId?: number;
    startDate?: string;
    weeks?: number;
    residenceId?: number;
    residenceWeeks?: number;
    airportId?: number;
    insurance?: boolean;
  };
  locale: Locale;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const hasMounted = useRef(false);

  const resolvedCourseId =
    initial.courseId && courses.some((course) => course.id === initial.courseId)
      ? initial.courseId
      : courses[0]?.id;
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
    !!initial.residenceId,
  );
  const [selectedResidenceId, setSelectedResidenceId] = useState<
    number | undefined
  >(resolvedResidenceId);
  const [residenceWeeks, setResidenceWeeks] = useState<number>(
    initial.residenceWeeks ?? initial.weeks ?? 1,
  );
  const [hasAirport, setHasAirport] = useState<boolean>(
    !!initial.airportId && Boolean(resolvedAirportId),
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
    () => courses.find((item) => item.id === selectedCourseId) ?? courses[0],
    [courses, selectedCourseId],
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
    const firstPackage = selectedResidence.accPackages?.[0];
    const firstRoomType = firstPackage?.roomTypes?.[0];
    const firstPlan = firstRoomType?.roomPlans?.[0];
    return (firstPlan?.amount ?? 0) * (residenceWeeks || weeks);
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
    if (weeks) params.set("weeks", String(weeks));
    if (hasAccommodation && selectedResidenceId)
      params.set("residence_id", String(selectedResidenceId));
    if (hasAccommodation && residenceWeeks)
      params.set("residence_weeks", String(residenceWeeks));
    if (hasAirport && selectedAirportId)
      params.set("airport_id", String(selectedAirportId));
    if (hasInsurance) params.set("insurance", "1");

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
    pathname,
    router,
  ]);

  return (
    <div className="bg-linear-to-b from-dark-orange via-light-orange to-white w-full">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="rounded-4xl border border-white/40 bg-white/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="flex flex-col gap-4 rounded-2xl border border-white/40 bg-white/70 p-5 shadow-sm sm:flex-row sm:items-center">
                <Image
                  src={`/images/schools/bayswater-english-school.png`}
                  alt={school.name?.[locale] ?? "School"}
                  width={200}
                  height={200}
                  className="h-28 w-28 rounded-2xl object-cover"
                />
                <div>
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
                      Course Start Date
                    </label>
                    <div className="w-full" dir="ltr">
                      <DatePicker
                        selected={startDate ? new Date(startDate) : null}
                        onChange={(date: Date | null) =>
                          setStartDate(
                            date ? date.toISOString().split("T")[0] : "",
                          )
                        }
                        placeholderText="Choose start date"
                        filterDate={(date) => date.getDay() === 1}
                        dateFormat="yyyy-MM-dd"
                        className="w-full rounded-2xl border border-white/40 bg-white/70 px-4 py-3 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white"
                        calendarStartDay={1}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-dark">
                      Study Duration (Weeks)
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
                    Find Courses
                  </h2>
                </div>
                <div className="mt-4 space-y-3">
                  {courses.map((item) => {
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

                    return (
                      <label
                        key={item.id}
                        className={`flex cursor-pointer flex-col gap-3 rounded-2xl border p-4 transition ${selected ? "border-dark-orange bg-orange-50" : "border-white/40 bg-white/70"}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="course"
                              checked={selected}
                              onChange={() => setSelectedCourseId(item.id)}
                              className="mt-1 h-4 w-4 accent-dark-orange"
                            />
                            <div>
                              <h3 className="font-semibold text-gray-dark">
                                {item.name?.[locale] ?? item.name}
                              </h3>
                              <p className="mt-1 text-sm text-gray-dark/70">
                                {item.description?.[locale] ?? ""}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-dark">
                              {formatPrice(price)}
                            </p>
                            <p className="text-xs text-gray-dark/60">
                              {weeks} weeks
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-dark/70">
                          {item.programs
                            .flatMap((program) => program.courses)
                            .map((programCourse, index) => (
                              <span
                                key={`${item.id}-${index}`}
                                className="flex items-center gap-1 rounded-full border border-white/40 bg-white px-2 py-1"
                              >
                                <Icon
                                  icon="mdi:book-open-page-variant"
                                  width={16}
                                  className="text-dark-orange"
                                />
                                {programCourse.lessonsPerWeek ?? "-"} lessons
                              </span>
                            ))}
                          <span className="flex items-center gap-1 rounded-full border border-white/40 bg-white px-2 py-1">
                            <Icon
                              icon="mdi:clock-outline"
                              width={16}
                              className="text-dark-orange"
                            />
                            {item.programs
                              .flatMap((program) => program.courses)
                              .reduce(
                                (sum, programCourse) =>
                                  sum + (programCourse.lessonsPerWeek ?? 0),
                                0,
                              )}{" "}
                            hours
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-2xl border border-white/40 bg-white/70 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-dark">
                    Accommodation
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
                    Include accommodation
                  </label>
                </div>

                {hasAccommodation ? (
                  <div className="mt-4 space-y-4">
                    <div className="space-y-3">
                      {accommodations.map((item) => {
                        const selected = item.id === selectedResidenceId;
                        const firstPackage = item.accPackages?.[0];
                        const firstRoomType = firstPackage?.roomTypes?.[0];
                        const firstPlan = firstRoomType?.roomPlans?.[0];
                        const packagePrice = firstPlan?.amount ?? 0;

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
                                    {firstPackage
                                      ? tx(firstPackage.packageName, locale)
                                      : `Accommodation ${item.id}`}
                                  </h3>
                                  {firstRoomType && (
                                    <p className="mt-1 text-sm text-gray-dark/70">
                                      {tx(firstRoomType.roomName, locale)}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-gray-dark">
                                  {formatPrice(packagePrice)}
                                </p>
                                <p className="text-xs text-gray-dark/60">
                                  per week
                                </p>
                              </div>
                            </div>
                            {firstRoomType?.roomPlans &&
                              firstRoomType.roomPlans.length > 0 && (
                                <div className="flex flex-wrap gap-3 text-sm text-gray-dark/70">
                                  {firstRoomType.roomPlans.map(
                                    (plan, index) => (
                                      <span
                                        key={`${item.id}-plan-${index}`}
                                        className="flex items-center gap-1 rounded-full border border-white/40 bg-white px-2 py-1"
                                      >
                                        <Icon
                                          icon="mdi:bed-outline"
                                          width={16}
                                          className="text-dark-orange"
                                        />
                                        {tx(plan.planName, locale)}
                                      </span>
                                    ),
                                  )}
                                </div>
                              )}
                          </label>
                        );
                      })}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-dark">
                        Accommodation Duration (Weeks)
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
                            {week} week{week > 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : null}
              </section>

              <section className="rounded-2xl border border-white/40 bg-white/70 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-dark">
                    Airport Pickup
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
                    Include airport transfer
                  </label>
                </div>
                {hasAirport ? (
                  <div className="mt-4">
                    <select
                      value={selectedAirportId ?? ""}
                      onChange={(event) =>
                        setSelectedAirportId(Number(event.target.value))
                      }
                      className="w-full rounded-2xl border border-white/40 bg-white/70 px-4 py-3 text-sm text-gray-dark outline-none transition focus:border-dark-orange focus:bg-white"
                    >
                      {transfers.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.serviceName?.[locale] ?? `Transfer ${item.id}`}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}
              </section>

              <section className="rounded-2xl border border-white/40 bg-white/70 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-dark">
                    Insurance
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
                    Add insurance
                  </label>
                </div>
              </section>
            </div>

            <aside className="rounded-4xl border border-white/40 bg-white/80 p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-gray-dark">Summary</h2>
              <div className="mt-4 space-y-3 text-sm text-gray-dark/80">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span>Course</span>
                  <span>{formatPrice(coursePrice)}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span>Accommodation</span>
                  <span>{formatPrice(accommodationPrice)}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span>Airport Pickup</span>
                  <span>{formatPrice(transferPrice)}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span>Insurance</span>
                  <span>{formatPrice(insurancePrice)}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span>Fixed fees</span>
                  <span>{formatPrice(fixedFeesTotal)}</span>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-dark-orange/10 p-4">
                <div className="flex items-center justify-between text-lg font-semibold text-gray-dark">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <h3 className="font-semibold text-gray-dark">Fixed Fees</h3>
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
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
