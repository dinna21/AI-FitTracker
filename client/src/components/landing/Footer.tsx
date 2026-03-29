import { footerData } from "../../data/landing/footer"
import { DribbbleIcon, LinkedinIcon, TwitterIcon, YoutubeIcon } from "lucide-react"
import { motion } from "motion/react"

export default function Footer() {
  return (
    <footer className="mt-28 border-t border-slate-200/70 px-4 py-8 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-10">
        <motion.div
          className="flex flex-wrap items-start gap-10"
          initial={{ x: -40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
        >
          {footerData.map((section) => (
            <div key={section.title}>
              <p className="font-semibold text-slate-900 dark:text-white">{section.title}</p>
              <ul className="mt-2 space-y-2">
                {section.links.map((link) => (
                  <li key={`${section.title}-${link.name}`}>
                    <a href={link.href} className="transition hover:text-emerald-600 dark:hover:text-emerald-300">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="flex flex-col gap-2 max-md:text-left md:items-end"
          initial={{ x: 40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
        >
          <p className="max-w-64 text-slate-600 dark:text-slate-300">
            Build healthier habits with a product experience users actually enjoy opening every day.
          </p>
          <div className="mt-2 flex items-center gap-4">
            <a
              href="https://dribbble.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our Dribbble profile"
              title="Dribbble"
            >
              <DribbbleIcon className="size-5 hover:text-emerald-500" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our LinkedIn page"
              title="LinkedIn"
            >
              <LinkedinIcon className="size-5 hover:text-emerald-500" />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our X profile"
              title="X"
            >
              <TwitterIcon className="size-5 hover:text-emerald-500" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our YouTube channel"
              title="YouTube"
            >
              <YoutubeIcon className="size-5 hover:text-emerald-500" />
            </a>
          </div>
          <p className="mt-2 text-xs">
            {new Date().getFullYear()} FitTracker. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
