import { Hero } from "@/components/hero";
import { DestinationsSection } from "@/components/destinations-section";
import { InstitutesSection } from "@/components/institutes-section";
import { CoursesSection } from "@/components/courses-section";
import { ProvenSection } from "@/components/proven-section";
import { CompleteSection } from "@/components/complete-section";
import { CtaSection } from "@/components/cta-section";
import { FaqSection } from "@/components/faq-section";
import { ContactSection } from "@/components/contact-section";
import { ReviewsSection } from "@/components/reviews-section";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <div className="page-gradient">
        <DestinationsSection />
        <InstitutesSection />
        <CoursesSection />
        <ProvenSection />
      </div>
      <div className="min-h-180 w-full bg-[url('/images/bg-illustration.png')] bg-contain bg-no-repeat bg-bottom">
        <CompleteSection />
      </div>
      <div className="bg-linear-to-b from-dark-orange via-light-orange to-white">
        <CtaSection />
        <FaqSection />
        <ContactSection />
      </div>
      <ReviewsSection />
    </main>
  );
}
