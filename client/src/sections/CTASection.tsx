import { motion } from "motion/react"
import { useNavigate } from "react-router-dom"

export default function CTASection() {
  const navigate = useNavigate()

  return (
    <section className="px-4 pb-14 md:px-10">
      <motion.div
        className="mx-auto mt-24 flex max-w-6xl flex-col items-start justify-between gap-6 rounded-3xl border border-emerald-400/30 bg-linear-to-r from-emerald-600 to-emerald-500 p-7 text-white md:flex-row md:items-center md:p-10"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 240, damping: 24 }}
      >
        <div>
          <motion.h3
            className="text-3xl font-bold md:text-4xl"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
          >
            Ready to turn your product into a growth engine?
          </motion.h3>
          <motion.p
            className="mt-2 text-emerald-50"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
          >
            Launch a scalable SaaS landing flow and keep extending it page by page.
          </motion.p>
        </div>

        <motion.button
          type="button"
          onClick={() => navigate("/login")}
          className="rounded-full bg-white px-9 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
        >
          Get Started
        </motion.button>
      </motion.div>
    </section>
  )
}
