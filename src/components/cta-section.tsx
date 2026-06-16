import { getTranslations } from "next-intl/server";
import Image from "next/image";

export async function CtaSection() {
  const t = await getTranslations("cta");

  return (
    <section className="">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-0">
        <div className="relative h-72 overflow-hidden rounded-2xl lg:my-12 lg:h-140">
          <Image
            src="/images/girl-on-phone.png"
            alt="Consultant on a call"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="text-white">
          <h2 className="text-balance text-2xl font-extrabold sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-black">
            {t("description")}
          </p>
          <button
            type="button"
            className="mt-6 rounded-lg bg-light-orange px-6 py-3 text-sm font-bold text-gray-dark shadow-md transition hover:bg-white"
          >
            {t("button")}
          </button>
        </div>
      </div>
    </section>
  );
}
