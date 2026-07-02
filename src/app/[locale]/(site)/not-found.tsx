import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="flex min-h-[70vh] flex-1 flex-col items-center justify-center px-4 text-center">
      <Image
        src="/logo.png"
        alt="Pro Student"
        width={72}
        height={72}
        className="h-16 w-16 object-contain"
      />
      <p className="mt-6 text-6xl font-extrabold text-dark-orange">404</p>
      <h1 className="mt-3 text-2xl font-extrabold text-gray-dark">
        {t("title")}
      </h1>
      <p className="mt-2 max-w-sm text-sm text-gray-light">{t("description")}</p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-dark-orange px-6 py-3 text-sm font-bold text-white transition hover:bg-red"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
