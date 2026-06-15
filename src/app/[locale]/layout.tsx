import type { Metadata } from "next";
import { Inter, Tajawal, Poppins } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "../globals.css";
import { CountryLinks } from "@/components/country-links";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});
const popppins = Poppins({
  weight: ["100", "400", "600", "700", "800"],
  variable: "--font-poppin",
  subsets: ["latin"],
  display: "swap",
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pro Student | Study Abroad",
  description:
    "Start your journey today and learn at the world's best institutes. Saudi consultants, genuine service and real results.",
  icons: { icon: "/logo.png" },
};

export const viewport = {
  themeColor: "#F8801F",
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${popppins.variable} ${tajawal.variable} h-full bg-background antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NextIntlClientProvider>
          <Header />
          {children}
          <CountryLinks />
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
