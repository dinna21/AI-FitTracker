import { motion } from "motion/react"
import type { TestimonialItem } from "../../types/landing"

type TestimonialCardProps = {
  testimonial: TestimonialItem
  index: number
}

export default function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  return (
    <motion.article
      className="mx-3 w-72 shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 250, damping: 24 }}
    >
      <div className="flex items-center gap-3">
        <img
          className="size-11 rounded-full object-cover"
          src={testimonial.image}
          alt={testimonial.name}
          height={44}
          width={44}
          loading="lazy"
        />
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{testimonial.handle}</p>
        </div>
      </div>
      <p className="pt-4 text-sm text-slate-600 dark:text-slate-300">{testimonial.quote}</p>
    </motion.article>
  )
}
