import { Header } from "@/components/header";
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
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <DestinationsSection />
        <InstitutesSection />
        <CoursesSection />
        <ProvenSection />
        <CompleteSection />
        <CtaSection />
        <FaqSection />
        <ContactSection />
        <ReviewsSection />
      </main>
      <Footer />
    </>
  );
}
