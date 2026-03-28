import Footer from "../components/landing/Footer"
import LenisScroll from "../components/landing/LenisScroll"
import Navbar from "../components/landing/Navbar"
import CTASection from "../sections/CTASection"
import ContactSection from "../sections/ContactSection"
import FeaturesSection from "../sections/FeaturesSection"
import HeroSection from "../sections/HeroSection"
import PricingSection from "../sections/PricingSection"
import TestimonialSection from "../sections/TestimonialSection"

export default function HomePage() {
  return (
    <div className="landing-dashboard-bg min-h-screen overflow-x-hidden pb-20 pt-8 md:pt-10">
      <LenisScroll />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <TestimonialSection />
      <PricingSection />
      <ContactSection />
      <CTASection />
      <Footer />
    </div>
  )
}
