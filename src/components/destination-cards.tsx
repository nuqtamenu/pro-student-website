import { getTranslations, getLocale } from "next-intl/server";
import { cities, tx, type Locale } from "@/lib/data";
import { SectionHeading } from "./section-heading";
import { Carousel } from "./carousel";
import DestinationCard from "./destination-card";

export async function DestinationsCards({
  label,
  title,
  countryId,
}: {
  label?: string;
  title: string;
  countryId: number;
}) {
  const t = await getTranslations("destinations");
  const locale = (await getLocale()) as Locale;

  return (
    <section className="py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading label={label} title={title} />
        <Carousel
          // visibleSlides={4}
          // slideGapClass="gap-10"
          slideClassName="basis-[78%] sm:basis-1/2 lg:basis-1/4"
        >
          {cities
            .filter((city) => city.countryId === countryId)
            .map((city) => (
              <DestinationCard
                key={city.id}
                image={`/images/destinations/cities/${city.image}`}
                alt={tx(city.name, locale)}
                name={tx(city.name, locale)}
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
