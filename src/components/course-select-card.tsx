"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { tx, type Locale } from "@/lib/data";
import { type Course } from "@/lib/v4-dsa";

type Props = {
  course: Course;
  locale: Locale;
  selected: boolean;
  lessons: number;
  hours: number;
  price: number;
  categoryLabel?: string;
  onSelect: () => void;
  formatPrice: (value: number) => string;
};

export default function CourseSelectCard({
  course,
  locale,
  selected,
  lessons,
  hours,
  price,
  categoryLabel,
  onSelect,
  formatPrice,
}: Props) {
  const t = useTranslations("schoolBooking");

  return (
    <label
      className={`flex cursor-pointer flex-col overflow-hidden rounded-2xl border shadow-sm transition ${selected ? "border-dark-orange bg-orange-50" : "border-white/40 bg-white/70"}`}
    >
      <div className="relative h-36">
        <Image
          src={`/images/courses/course-placeholder.png`}
          alt={course.courseName?.[locale] ?? t("course")}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <p className="text-sm text-gray-light">
            {categoryLabel ?? t("course")}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-gray-dark">
            {tx(course.courseName, locale)}
          </h3>
          <p className="mt-2 text-sm text-gray-dark/70">
            {tx(course.courseDescription ?? { en: "", ar: "" }, locale)}
          </p>
        </div>
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-1 text-sm text-gray-dark/70">
            <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white px-2 py-1">
              <Icon icon="mdi:teach" width={16} className="text-dark-orange" />
              {t("lessonsPerWeek", { count: lessons })}
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white px-2 py-1">
              <Icon
                icon="mdi:clock-outline"
                width={16}
                className="text-dark-orange"
              />
              {t("hoursPerWeek", { count: hours })}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="course"
                checked={selected}
                onChange={onSelect}
                className="h-4 w-4 accent-dark-orange"
              />
              <span className="text-sm text-gray-dark/80">{t("select")}</span>
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
}
