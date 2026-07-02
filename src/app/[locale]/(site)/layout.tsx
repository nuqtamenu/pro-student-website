import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CountryLinks } from "@/components/country-links";
import { getTranslations } from "next-intl/server";
import WhatsappWidget from "@/components/whats-app-widget";

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const t = await getTranslations("header");

  return (
    <main>
      <Header />
      {/* Tagline strip */}
      <div className="sticky top-0 left-0 z-20">
        <p className="px-4 py-4 text-center font-bold tracking-wid mb-2 bg-white">
          {t("tagline")}
        </p>
      </div>
      {children}
      <CountryLinks />
      <Footer />
      <WhatsappWidget />
    </main>
  );
}
