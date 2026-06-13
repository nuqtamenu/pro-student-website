import { getTranslations } from "next-intl/server";
import Image from "next/image";

export async function ProvenSection() {
  const t = await getTranslations("proven");

  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <div className="relative h-72 overflow-hidden rounded-2xl sm:h-96">
          <Image
            src="/images/student-traveler.png"
            alt="Happy student exploring a new city"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-dark-orange">
            {t("label")}
          </span>
          <h2 className="mt-2 text-balance text-2xl font-extrabold text-gray-dark sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-gray-light">
            {t("description")}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-6">
            <div>
              <p className="text-3xl font-extrabold text-dark-orange sm:text-4xl">
                {t("stat1Value")}
              </p>
              <p className="mt-1 text-sm text-gray-light">{t("stat1Label")}</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-dark-orange sm:text-4xl">
                {t("stat2Value")}
              </p>
              <p className="mt-1 text-sm text-gray-light">{t("stat2Label")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
