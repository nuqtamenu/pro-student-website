import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
import { cities, tx, type Locale } from "@/lib/data";
import { SectionHeading } from "./section-heading";
import { Carousel } from "./carousel";

export async function DestinationsSection() {
  const t = await getTranslations("destinations");
  const locale = (await getLocale()) as Locale;

  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading label={t("label")} title={t("title")} />
        <Carousel slideClassName="basis-[78%] sm:basis-1/2 lg:basis-1/4">
          {cities.map((city) => (
            <article
              key={city.id}
              className="group relative h-[420px] overflow-hidden rounded-2xl"
            >
              <Image
                src={city.image || "/placeholder.svg"}
                alt={tx(city.name, locale)}
                fill
                sizes="(max-width: 768px) 80vw, 25vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="destination-overlay absolute inset-0" />
              <span className="absolute start-4 top-4 rounded-full bg-dark-orange px-3 py-1 text-xs font-bold text-white shadow">
                {city.schoolsCount} {t("schools")}
              </span>
              <h3 className="absolute inset-x-4 bottom-5 text-xl font-extrabold text-white drop-shadow-lg">
                {tx(city.name, locale)}
              </h3>
            </article>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
