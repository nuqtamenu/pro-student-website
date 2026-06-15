import { getTranslations, getLocale } from "next-intl/server";
import { countries, tx, type Locale } from "@/lib/data";
import { SectionHeading } from "./section-heading";
import { Carousel } from "./carousel";
import DestinationCard from "./destination-card";

export async function DestinationsSection() {
  const t = await getTranslations("destinations");
  const locale = (await getLocale()) as Locale;

  return (
    <section className="py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading label={t("label")} title={t("title")} />
        <Carousel
          // visibleSlides={4}
          // slideGapClass="gap-10"
          slideClassName="basis-[78%] sm:basis-1/2 lg:basis-1/4"
        >
          {countries.map((country) => (
            <DestinationCard
              key={country.id}
              image={`/images/destinations/countries/${country.image}`}
              alt={tx(country.name, locale)}
              name={tx(country.name, locale)}
              labelCount={13}
              lableText={t("schools")}
              locale={locale}
            />
          ))}
        </Carousel>
      </div>
    </section>
  );
}
