"use client";

import Image from "next/image";

type Props = {
  name: string;
  description: string;
  image: string;
  cta: string;
  locale: "en" | "ar";
};
export default function InstituteCard({
  name,
  description,
  image,
  cta,
  locale,
}: Props) {
  return (
    <article className="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-dark-orange shadow-sm ring-1 ring-black/5">
      <div className="relative h-60">
        <Image
          src={`/images/schools/${image}` || "/placeholder.svg"}
          alt={name}
          fill
          sizes="(max-width: 768px) 80vw, 25vw"
          className="object-cover"
        />
      </div>
      <div className="flex w-full items-center justify-end">
        <div
          className={`bg-cream/79 p-4 ${locale === "ar" ? "rounded-r-xl" : "rounded-l-xl"} mt-[-25%] relative z-2 w-[80%] min-h-50 h-auto`}
        >
          <h3 className="text-2xl font-medium text-gray-dark">{name}</h3>
          <p className="mt-2 line-clamp-4 flex-1 text-base leading-relaxed text-black">
            {description}
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-end p-4">
        <button
          type="button"
          className="mt-4 w-full rounded-lg bg-light-orange py-2 text-sm font-bold text-gray-dark transition hover:bg-linear-to-r hover:from-dark-orange hover:to-light-orange hover:text-white cursor-pointer hover:shadow"
        >
          {cta}
        </button>
      </div>
    </article>
  );
}
