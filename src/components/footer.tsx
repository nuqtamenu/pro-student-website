import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Icon } from "@iconify/react";

export async function Footer() {
  const t = await getTranslations("footer");
  const columnLinks = t.raw("columnLinks") as string[];

  const linkColumns = [
    t("studyingEnglish"),
    t("recommendedSchools"),
    t("studyingEnglish2"),
  ];

  const socials = [
    "ri:twitter-x-fill",
    "mdi:instagram",
    "ic:baseline-whatsapp",
    "mdi:linkedin",
  ];

  return (
    <footer className="mt-auto">
      {/* SEO link columns */}
      <div className="bg-white py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-3">
          {linkColumns.map((heading, ci) => (
            <div key={ci}>
              <h3 className="mb-3 text-sm font-bold text-dark-orange">
                {heading}
              </h3>
              <ul className="flex flex-col gap-2">
                {columnLinks.map((link, li) => (
                  <li key={li}>
                    <a
                      href="#"
                      className="text-xs text-gray-light transition hover:text-dark-orange"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Main dark footer */}
      <div className="bg-gray-dark text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          <div>
            <Image
              src="/logo.png"
              alt="Pro Student"
              width={64}
              height={64}
              className="h-14 w-14 object-contain"
            />
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-white/70">
              {t("about")}
            </p>
          </div>

          <FooterColumn
            title={t("services")}
            links={[t("links.institutes"), t("links.visaApplication"), t("links.offers")]}
          />
          <FooterColumn
            title={t("company")}
            links={[t("links.aboutCompany"), t("links.terms"), t("links.getQuote")]}
          />

          <div>
            <h3 className="mb-4 text-sm font-bold">{t("getInTouch")}</h3>
            <a
              href="tel:0580666525"
              className="flex items-center gap-2 text-xs text-white/70 transition hover:text-light-orange"
            >
              <Icon icon="lucide:phone" width={14} />
              058-0666-525
            </a>
            <a
              href="mailto:admin@prostudent.com"
              className="mt-2 flex items-center gap-2 text-xs text-white/70 transition hover:text-light-orange"
            >
              <Icon icon="lucide:mail" width={14} />
              admin@prostudent.com
            </a>
            <div className="mt-4 flex gap-3">
              {socials.map((icon) => (
                <a
                  key={icon}
                  href="#"
                  aria-label={icon}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-dark-orange"
                >
                  <Icon icon={icon} width={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <p className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-white/50 sm:px-6">
            {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold">{title}</h3>
      <ul className="flex flex-col gap-2.5">
        {links.map((link, i) => (
          <li key={i}>
            <a
              href="#"
              className="text-xs text-white/70 transition hover:text-light-orange"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
