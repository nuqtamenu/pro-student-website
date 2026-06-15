import { getTranslations, getLocale } from "next-intl/server";

import { schools, tx, type Locale } from "@/lib/data";
import { SectionHeading } from "./section-heading";
import { Carousel } from "./carousel";
import InstituteCard from "./institute-card";
export async function InstitutesSection() {
  const t = await getTranslations("institutes");
  const locale = (await getLocale()) as Locale;
  return (
    <section className="py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading label={t("label")} title={t("title")} />
        <Carousel slideClassName="basis-[80%] sm:basis-1/2 lg:basis-1/4">
          {schools.map((school) => (
            <InstituteCard
              key={school.id}
              name={tx(school.name, locale)}
              description={tx(school.description, locale)}
              image={school.image || "school-placeholder.jpg"}
              cta={t("explore")}
              locale={locale}
            />
          ))}
        </Carousel>
      </div>
    </section>
  );
}
