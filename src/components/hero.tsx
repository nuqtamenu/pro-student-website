import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { HeroForm } from "./hero-form";
import { GoogleRating } from "./google-rating";

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className="relative overflow-hidden hero-gradient">
      {/* BG Layer */}
      <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t"></div>
        <Image
          src="/images/hero-bg2.png"
          alt="Pro Student"
          width={500}
          height={500}
          className="h-auto w-full max-w-150"
        />
      </div>
      <div className="relative z-2 mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:pb-24 lg:pt-14">
        <div className="grid items-start gap-0 lg:grid-cols-[3fr_1fr]">
          <div>
            <h1 className="text-balance text-3xl font-extrabold leading-tight text-gray-dark">
              {t("title")}
            </h1>
            <p className="mt-4 text-pretty text-sm leading-relaxed text-gray-dark/80 sm:text-base">
              {t("description")}
              <br />
              {t("description2")}
            </p>
          </div>

          <div className="hidden lg:flex justify-center lg:justify-end">
            <Image
              src="/logo.png"
              alt="Pro Student"
              width={160}
              height={160}
              className="h-28 w-28 object-contain sm:h-36 sm:w-36"
            />
          </div>
        </div>

        <div className="mt-8 grid items-center lg:grid-cols-[1.4fr_1fr] gap-10">
          <HeroForm />
          <div className="hidden lg:flex justify-center lg:justify-end lg:pb-2">
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
