"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useTranslations } from "use-intl";

type Props = {
  image: string;
  name: string;
  discount?: number;
  lessons: number;
  price: number;
  category: string;
  hours: number;
  requiredLevel: string;
  instituteName?: string;
  location?: string;
  onApply?: () => void;
};
export default function CourseCard({
  image,
  name,
  discount,
  category,
  lessons,
  hours,
  requiredLevel,
  price,
  instituteName = "",
  location = "",
  onApply,
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
          <p className="mt-1 text-sm text-gray-light">{category}</p>
        </div>
        <h3 className="text-lg font-bold text-gray-dark">{name}</h3>
        <div className="mt-2 space-y-1 text-sm text-gray-light">
          {instituteName ? <p>{instituteName}</p> : null}
          {location ? <p>{location}</p> : null}
        </div>

        {/* Course Details */}
        <div className="my-2 flex flex-col gap-2">
          {lessons && lessons > 0 && (
            <div className="grid grid-cols-[60%_40%]">
              <div className="flex items-center gap-2">
                <Icon icon={"mdi:teach"} width={20} />
                <p className="text-xs">{t("lessons")}</p>
              </div>
              <div className="text-xs">{lessons}</div>
            </div>
          )}
          {hours && hours > 0 && (
            <div className="grid grid-cols-[60%_40%]">
              <div className="flex items-center gap-2">
                <Icon icon={"mage:hour-glass"} width={20} />
                <p className="text-xs">{t("hours")}</p>
              </div>
              <div className="text-xs">{hours}</div>
            </div>
          )}
          {requiredLevel && (
            <div className="grid grid-cols-[60%_40%]">
              <div className="flex gap-2">
                <Icon icon={"ooui:level-two-ltr"} width={16} />
                <p className="text-xs">{t("required")}</p>
              </div>
              <div className="text-xs">{requiredLevel}</div>
            </div>
          )}
        </div>
        <div className="h-0.5 my-1 bg-black w-full"></div>
        {/* Pricing */}
        <div className="flex items-center justify-end gap-2">
          {false && (
            <p className="line-through text-sm font-medium text-red-600">
              £{price}
            </p>
          )}
          <p className="font-bold text-xl">
            £{discountedPrice} {t("perWeek")}
          </p>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={onApply}
            className="w-full rounded-lg bg-light-orange py-2 text-sm font-bold text-gray-dark transition hover:bg-dark-orange hover:text-white cursor-pointer"
          >
            {t("applyNow")}
          </button>
        </div>
      </div>
    </article>
  );
}
