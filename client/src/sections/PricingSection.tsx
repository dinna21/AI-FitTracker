import { CheckIcon } from "lucide-react"
import { motion } from "motion/react"
import SectionTitle from "../components/landing/SectionTitle"
import { pricingData } from "../data/landing/pricing"

export default function PricingSection() {
  return (
    <section id="pricing" className="px-4 md:px-10">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          title="Plans that scale with your users"
          subtitle="Transparent pricing designed for early stage teams and fast-growing products."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {pricingData.map((plan, index) => (
            <motion.article
              key={plan.name}
              className={`rounded-2xl border p-6 ${
                plan.mostPopular
                  ? "relative border-emerald-500 bg-emerald-500/5 shadow-lg shadow-emerald-500/20"
                  : "border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
              }`}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, type: "spring", stiffness: 240, damping: 24 }}
            >
              {plan.mostPopular && (
                <p className="absolute -top-3 left-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                  Most Popular
                </p>
              )}

              <p className="font-semibold text-slate-900 dark:text-white">{plan.name}</p>
              <p className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">
                ${plan.price}
                <span className="ml-1 text-sm font-normal text-slate-500">/{plan.period}</span>
              </p>

              <ul className="mt-6 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <CheckIcon className="size-4 text-emerald-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={`mt-7 w-full rounded-lg py-2.5 font-semibold transition ${
                  plan.mostPopular
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                }`}
              >
                Get Started
              </button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
