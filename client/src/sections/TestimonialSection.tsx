import Marquee from "react-fast-marquee"
import SectionTitle from "../components/landing/SectionTitle"
import TestimonialCard from "../components/landing/TestimonialCard"
import { testimonialsData } from "../data/landing/testimonials"

export default function TestimonialSection() {
  return (
    <section id="testimonials" className="px-4 md:px-10">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          title="What teams are saying after switching"
          subtitle="Social proof that supports conversion and trust above the fold and below it."
        />

        <Marquee className="testimonial-marquee mt-12" gradient={false} speed={25}>
          <div className="flex items-center py-5">
            {[...testimonialsData, ...testimonialsData].map((testimonial, index) => (
              <TestimonialCard key={`${testimonial.handle}-left-${index}`} testimonial={testimonial} index={index} />
            ))}
          </div>
        </Marquee>

        <Marquee className="testimonial-marquee mt-2" gradient={false} speed={25} direction="right">
          <div className="flex items-center py-5">
            {[...testimonialsData, ...testimonialsData].map((testimonial, index) => (
              <TestimonialCard key={`${testimonial.handle}-right-${index}`} testimonial={testimonial} index={index} />
            ))}
          </div>
        </Marquee>
      </div>
    </section>
  )
}
