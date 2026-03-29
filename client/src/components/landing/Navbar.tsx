import { MenuIcon, XIcon, Activity } from "lucide-react"
import { useState } from "react"
import { motion } from "motion/react"
import { useNavigate } from "react-router-dom"
import { landingNavLinks } from "../../data/landing/navlinks"

function scrollToHash(hash: string) {
  const id = hash.replace("#", "")
  const target = document.getElementById(id)
  if (!target) return
  target.scrollIntoView({ behavior: "smooth", block: "start" })
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      <motion.nav
        className="fixed left-1/2 top-2 z-60 flex w-[calc(100%-1rem)] max-w-6xl -translate-x-1/2 items-center justify-between rounded-2xl border border-slate-200/70 bg-white/75 px-4 py-2.5 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/70 sm:top-4 sm:px-5 sm:py-3 md:px-8"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
      >
        <div className="flex items-center gap-2.5 text-slate-900 dark:text-white">
          <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500 shadow-md shadow-emerald-500/30">
            <Activity className="text-white" size={18} />
          </div>
          <span className="text-base font-bold">FitTracker SaaS</span>
        </div>

        <div className="hidden items-center gap-7 md:flex">
          {landingNavLinks.map((link) => (
            <button
              key={link.href}
              type="button"
              onClick={() => scrollToHash(link.href)}
              className="text-sm font-medium text-slate-600 transition hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-300"
            >
              {link.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="hidden rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 md:block"
          onClick={() => navigate("/login")}
        >
          Start free trial
        </button>

        <button type="button" onClick={() => setIsOpen(true)} className="md:hidden" aria-label="Open menu">
          <MenuIcon size={22} className="text-slate-700 dark:text-slate-200" />
        </button>
      </motion.nav>

      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-7 bg-slate-950/90 text-lg text-white backdrop-blur md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
      >
        {landingNavLinks.map((link) => (
          <button
            type="button"
            key={link.href}
            onClick={() => {
              scrollToHash(link.href)
              setIsOpen(false)
            }}
            className="text-slate-100"
          >
            {link.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="flex size-10 items-center justify-center rounded-lg bg-emerald-500"
          aria-label="Close menu"
        >
          <XIcon size={18} />
        </button>
      </div>
    </>
  )
}
