import { ArrowRightIcon, MailIcon, UserIcon } from "lucide-react"
import { motion } from "motion/react"
import SectionTitle from "../components/landing/SectionTitle"

export default function ContactSection() {
  return (
    <section id="contact" className="px-4 md:px-10">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          title="Let us help you launch faster"
          subtitle="Tell us about your product goals and we will tailor a rollout plan for your team."
        />

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto mt-14 grid w-full max-w-2xl gap-4 sm:grid-cols-2"
        >
          <motion.div
            initial={{ y: 36, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
          >
            <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">Your name</p>
            <div className="flex items-center rounded-xl border border-slate-300 bg-white pl-3 dark:border-slate-700 dark:bg-slate-900">
              <UserIcon className="size-5 text-slate-400" />
              <input
                name="name"
                type="text"
                placeholder="Enter your name"
                className="w-full bg-transparent p-3 outline-none"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 36, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
          >
            <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">Email</p>
            <div className="flex items-center rounded-xl border border-slate-300 bg-white pl-3 dark:border-slate-700 dark:bg-slate-900">
              <MailIcon className="size-5 text-slate-400" />
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent p-3 outline-none"
              />
            </div>
          </motion.div>

          <motion.div
            className="sm:col-span-2"
            initial={{ y: 36, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
          >
            <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">Message</p>
            <textarea
              name="message"
              rows={6}
              placeholder="Tell us what you are building"
              className="w-full resize-none rounded-xl border border-slate-300 bg-white p-3 outline-none dark:border-slate-700 dark:bg-slate-900"
            />
          </motion.div>

          <motion.button
            type="submit"
            className="flex w-max items-center gap-2 rounded-full bg-emerald-600 px-8 py-3 font-semibold text-white transition hover:bg-emerald-700"
            initial={{ y: 36, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
          >
            Submit
            <ArrowRightIcon className="size-5" />
          </motion.button>
        </form>
      </div>
    </section>
  )
}
