import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { HeroForm } from "./hero-form";
import { GoogleRating } from "./google-rating";

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className="hero-gradient relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:pb-24 lg:pt-14">
        <div className="grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h1 className="max-w-3xl text-balance text-3xl font-extrabold leading-tight text-gray-dark sm:text-4xl lg:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-gray-dark/80 sm:text-base">
              {t("description")}
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <Image
              src="/logo.png"
              alt="Pro Student"
              width={160}
              height={160}
              className="h-28 w-28 object-contain sm:h-36 sm:w-36"
            />
          </div>
        </div>

        <div className="mt-8 grid items-end gap-6 lg:grid-cols-[1.4fr_1fr]">
          <HeroForm />
          <div className="flex justify-center lg:justify-end lg:pb-2">
            <GoogleRating
              title={t("reviewsTitle")}
              count={t("reviewsCount")}
              rating={t("rating")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
