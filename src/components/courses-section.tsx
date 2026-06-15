import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
import { courses, tx, type Locale } from "@/lib/data";
import { SectionHeading } from "./section-heading";
import { Carousel } from "./carousel";
import CourseCardSimple from "./course-card-simple";

export async function CoursesSection() {
  const t = await getTranslations("courses");
  const ctas = await getTranslations("ctas");
  const locale = (await getLocale()) as Locale;

  return (
    <section className="py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading label={t("label")} title={t("title")} />
        <Carousel
          slideClassName="basis-[80%] sm:basis-1/2 lg:basis-1/4"
          // slideGapClass="gap-10"
        >
          {courses.map((course) => (
            <CourseCardSimple
              key={course.id}
              name={tx(course.name, locale)}
              provider=""
              discount={course.discount}
              image={course.image || "course-placeholder.png"}
              cta={ctas("explore")}
            />
          ))}
        </Carousel>
      </div>
    </section>
  );
}
