"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
export type Props = {
  image: string;
  title: string;
  description: string;
  publishedAt: string;
};

export default function BlogCard({
  image,
  title,
  description,
  publishedAt,
}: Props) {
  const t = useTranslations("ctas");
  return (
    <div className="rounded-2xl bg-cream overflow-hidden shadow">
      {/* Image */}
      <div className="w-full h-40 overflow-hidden">
        <Image
          src={`/images/blog-placeholder.jpg`}
          alt={title}
          height={200}
          width={200}
          className="w-full h-full object-cover"
        />
      </div>
      {/* Meta Data */}
      <div className="p-4">
        {/* Title */}
        <p className="text-gray-light text-sm mb-2 font-medium">
          {publishedAt}
        </p>
        <h3 className="font-bold text-xl">{title}</h3>
        {/* Description */}
        <p className="text-sm mt-1 line-clamp-3">{description}</p>
        {/* CTA */}
        <button
          type="button"
          className="mt-4 rounded-lg bg-light-orange py-2 text-sm font-bold text-gray-dark transition hover:bg-dark-orange hover:text-white cursor-pointer w-full"
        >
          {t("readMore")}
        </button>
      </div>
    </div>
  );
}
