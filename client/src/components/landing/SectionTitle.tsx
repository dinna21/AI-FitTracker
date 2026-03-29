import { motion } from "motion/react"

type SectionTitleProps = {
  title: string
  subtitle: string
}

export default function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <>
      <motion.h2
        className="mx-auto mt-10 max-w-2xl text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:mt-14 md:mt-20 md:text-4xl"
        initial={{ y: 60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
      >
        {title}
      </motion.h2>
      <motion.p
        className="mx-auto mt-3 max-w-2xl text-center text-slate-600 dark:text-slate-300"
        initial={{ y: 60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
      >
        {subtitle}
      </motion.p>
    </>
  )
}
