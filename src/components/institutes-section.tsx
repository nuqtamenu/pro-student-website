import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
import { schools, tx, type Locale } from "@/lib/data";
import { SectionHeading } from "./section-heading";
import { Carousel } from "./carousel";

export async function InstitutesSection() {
  const t = await getTranslations("institutes");
  const locale = (await getLocale()) as Locale;
  return (
    <section className="py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading label={t("label")} title={t("title")} />
        <Carousel slideClassName="basis-[80%] sm:basis-1/2 lg:basis-1/4">
          {schools.map((school) => (
            <article
              key={school.id}
              className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5"
            >
              <div className="relative h-60">
                <Image
                  src={`/images/schools/${school.image}` || "/placeholder.svg"}
                  alt={tx(school.name, locale)}
                  fill
                  sizes="(max-width: 768px) 80vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="flex w-full items-center justify-end">
                <div
                  className={`bg-cream/79 p-4 ${locale === "ar" ? "rounded-r-xl" : "rounded-l-xl"} mt-[-25%] relative z-2 w-[80%] min-h-50 h-auto`}
                >
                  <h3 className="text-2xl font-medium text-gray-dark">
                    {tx(school.name, locale)}
                  </h3>
                  <p className="mt-2 line-clamp-4 flex-1 text-base leading-relaxed text-black">
                    {tx(school.description, locale)}
                  </p>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <button
                  type="button"
                  className="mt-4 w-full rounded-lg bg-light-orange py-2 text-sm font-bold text-gray-dark transition hover:bg-dark-orange hover:text-white cursor-pointer"
                >
                  {t("explore")}
                </button>
              </div>
            </article>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
