import { getTranslations } from "next-intl/server";
import { GoogleRating } from "./google-rating";

export default async function HeroGoogleRating() {
  const t = await getTranslations("hero");
  return (
    <div className="flex items-center justify-center w-full my-10">
      <GoogleRating
        title={t("reviewsTitle")}
        count={t("reviewsCount")}
        rating={t("rating")}
      />
    </div>
  );
}
