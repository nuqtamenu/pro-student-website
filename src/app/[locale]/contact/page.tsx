import { Icon } from "@iconify/react";
import { getTranslations } from "next-intl/server";
import ContactForm from "@/components/contact-form";
import Image from "next/image";
export default async function ContactPage() {
  const t = await getTranslations("contactPage");
  const socials = [
    { icon: "ic:baseline-call", href: "#", label: "Call" },
    { icon: "ic:baseline-whatsapp", href: "#", label: "WhatsApp" },
    { icon: "ri:twitter-x-fill", href: "#", label: "X" },
    { icon: "mdi:instagram", href: "#", label: "Instagram" },
  ];
  return (
    <div className="bg-linear-to-b from-dark-orange via-light-orange to-white w-full py-20">
      {/* Text */}
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h3 className="text-2xl font-bold">{t("title")}</h3>
        <p className="w-full max-w-150 mt-2">{t("description")}</p>

        {/* Contact Details */}
        <ul className="my-10 flex flex-col gap-4">
          <li className="flex items-start gap-2">
            <Icon icon={"ic:outline-email"} width={24} />
            <span className="font-medium">{t("email")}</span>
            <p>admission@prostudent.com.sa</p>
          </li>
          <li className="flex items-start gap-2">
            <Icon icon={"ic:round-phone"} width={24} />
            <span className="font-medium">{t("phone")}</span>
            <p dir="ltr">+966 58 066 6525</p>
          </li>
          <li className="flex items-start gap-2">
            <Icon icon={"boxicons:location"} width={24} />
            <span className="font-medium">{t("address")}</span>
            <p className="max-w-150">
               Reem Commercial Center -عمارة معرض السيارات - VIP Lounge -الدور
              الاول-مكتب ١١, District, 3776 Dajla Street, AlSahafa, Riyadh
            </p>
          </li>
        </ul>
        <div className="flex gap-2">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-dark-orange text-white transition hover:bg-red"
            >
              <Icon icon={s.icon} width={20} />
            </a>
          ))}
        </div>
        {/* Form & Map */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Form */}
          <div>
            <div className="glass rounded-2xl border border-white/20 bg-white/20 p-6 shadow-sm backdrop-blur">
              <ContactForm />
            </div>
          </div>

          {/* Map */}
          <div>
            <div className="rounded-2xl overflow-hidden border border-white/20 shadow-sm">
              {/* Use a simple Google Maps embed by searching the address */}
              {/** Address used for map search */}
              <iframe
                title="Pro Student Office Location"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  "Reem Commercial Center -عمارة معرض السيارات - VIP Lounge -الدور الاول-مكتب 11, District, 3776 Dajla Street, AlSahafa, Riyadh",
                )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-80 border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
        {/* Certificate & Heading */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 mt-8 py-10">
          <h4 className="text-2xl font-medium">{t("certificateTitle")}</h4>
          <div>
            <Image
              src={"/images/certificate.png"}
              alt="Pro Student ICEF Certificate"
              width={150}
              height={150}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
