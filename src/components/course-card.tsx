"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useTranslations } from "use-intl";

type Props = {
  image: string;
  name: string;
  discount?: number;
  lessons: number;
  week: number;
  price: number;
  category: string;
  hours: number;
  requiredLevel: string;
};
export default function CourseCard({
  image,
  name,
  discount,
  category,
  lessons,
  week,
  hours,
  requiredLevel,
  price,
}: Props) {
  const t = useTranslations("coursesPage.courseCard");
  const discountedPrice = discount ? price - (price * discount) / 100 : price;
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
      <div className="relative h-40 ">
        <Image
          src={`/images/courses/${image}`}
          alt={name}
          fill
          sizes="(max-width: 768px) 80vw, 25vw"
          className="object-cover"
        />
        {discount && (
          <span className="absolute inset-e-3 top-3 rounded-full bg-light-orange flex items-center justify-center size-10 text-xs font-bold  shadow">
            {discount} %
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between p-4 bg-cream">
        <div>
          <p className="mt-1 text-gray-light">{category}</p>
        </div>
        <h3 className="text-xl font-bold text-gray-dark">{name}</h3>

        {/* Course Details */}
        <div className="my-2">
          <div className="grid grid-cols-2">
            <div className="flex items-center gap-2">
              <Icon icon={"mdi:teach"} width={20} />
              <p className="text-xs">{t("lessons")}</p>
            </div>
            <div>{Math.ceil(lessons / week)}</div>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex items-center gap-2">
              <Icon icon={"mage:hour-glass"} width={20} />
              <p className="text-xs">{t("hours")}</p>
            </div>
            <div>{hours}</div>
          </div>
          {requiredLevel && (
            <div className="grid grid-cols-2 items-center">
              <div className="flex items-center gap-2">
                <Icon icon={"ooui:level-two-ltr"} width={16} />
                <p className="text-xs">{t("required")}</p>
              </div>
              <div>{requiredLevel}</div>
            </div>
          )}
        </div>
        {/* Pricing */}
        <div className="flex items-center justify-end gap-2">
          <p className="line-through text-sm">
            {t("sar")} {price}
          </p>
          <p className="font-bold text-xl">
            {t("sar")} {discountedPrice}
          </p>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="mt-4 rounded-lg bg-light-orange py-2 text-sm font-bold text-gray-dark transition hover:bg-dark-orange hover:text-white cursor-pointer"
          >
            {t("applyNow")}
          </button>
          <button
            type="button"
            className="mt-4 rounded-lg bg-light-orange py-2 text-sm font-bold text-gray-dark transition hover:bg-dark-orange hover:text-white cursor-pointer"
          >
            {t("learnMore")}
          </button>
        </div>
      </div>
    </article>
  );
}
