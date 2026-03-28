import { useRef, useState } from "react"
import { CheckIcon, ChevronRightIcon, VideoIcon } from "lucide-react"
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react"
import { useNavigate } from "react-router-dom"
import TiltImage from "../components/landing/TiltImage"

const chapters = [
  {
    eyebrow: "YOUR DAY, YOUR DATA",
    title: "Fitness goals fail when progress feels invisible.",
    description:
      "Most plans break because tracking is scattered. FitTracker turns meals, activities, and habits into one daily story.",
    bullets: ["No more disconnected apps", "Clear daily focus", "Momentum you can measure"],
    cta: "Start your story",
  },
  {
    eyebrow: "CHAPTER 2",
    title: "Log meals and workouts in seconds, not minutes.",
    description:
      "Capture what you eat, what you train, and what you burn. Every entry builds a complete timeline you can trust.",
    bullets: ["Meal + activity logging", "Clean daily summaries", "Habit-first workflow"],
    cta: "Track your first day",
  },
  {
    eyebrow: "CHAPTER 3",
    title: "Watch consistency turn into visible progress.",
    description:
      "When streaks, calories, and activity sit in one place, patterns appear early so you can adjust before motivation drops.",
    bullets: ["Spot trends quickly", "Correct course earlier", "Stay accountable"],
    cta: "See your dashboard",
  },
  {
    eyebrow: "FINAL CHAPTER",
    title: "Build a healthier routine that actually sticks.",
    description:
      "Start with one day, then repeat. FitTracker gives you the structure to keep showing up and the proof that it works.",
    bullets: ["Simple daily loop", "Progress over perfection", "Ready when you are"],
    cta: "Get started",
  },
] as const

function StaticHero({ onGetStarted }: { onGetStarted: () => void }) {
  const chapter = chapters[0]

  return (
    <section className="relative overflow-hidden px-4 pb-8 pt-6 md:px-10">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 size-130 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />

      <div className="mx-auto max-w-6xl text-center">
        <motion.button
          type="button"
          className="group inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-emerald-700 dark:text-emerald-200"
          initial={{ y: -18, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 240, damping: 22 }}
        >
          <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">NEW</span>
          <span className="flex items-center gap-1 text-sm font-medium">
            Scroll-driven fitness storytelling
            <ChevronRightIcon size={16} className="transition group-hover:translate-x-0.5" />
          </span>
        </motion.button>

        <motion.h1
          className="mx-auto mt-8 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-6xl"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
        >
          {chapter.title}
        </motion.h1>

        <motion.p
          className="mx-auto mt-5 max-w-xl text-slate-600 dark:text-slate-300"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05, type: "spring", stiffness: 220, damping: 24 }}
        >
          {chapter.description}
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
          initial={{ y: 26, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
        >
          <button
            type="button"
            onClick={onGetStarted}
            className="rounded-full bg-emerald-600 px-6 py-2.5 font-semibold text-white transition hover:bg-emerald-700"
          >
            {chapter.cta}
          </button>
          <button className="flex items-center gap-2 rounded-full border border-slate-300 px-6 py-2.5 font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
            <VideoIcon strokeWidth={1.5} />
            Watch demo
          </button>
        </motion.div>

        <div className="mt-10 flex flex-wrap justify-center gap-5">
          {chapter.bullets.map((item, index) => (
            <motion.p
              key={item}
              className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.25 }}
            >
              <CheckIcon className="size-4 text-emerald-500" />
              {item}
            </motion.p>
          ))}
        </div>

        <TiltImage />
      </div>
    </section>
  )
}

export default function HeroSection() {
  const navigate = useNavigate()
  const sectionRef = useRef<HTMLElement | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 135,
    damping: 32,
    mass: 0.3,
  })

  const [activeChapter, setActiveChapter] = useState(0)

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    const nextChapter = Math.min(chapters.length - 1, Math.floor(latest * chapters.length))
    setActiveChapter((prev) => (prev === nextChapter ? prev : nextChapter))
  })

  const stageScale = useTransform(smoothProgress, [0, 1], [1, 0.94])
  const stageY = useTransform(smoothProgress, [0, 1], [0, -18])
  const glowOpacity = useTransform(smoothProgress, [0, 0.7, 1], [0.7, 0.95, 0.5])

  const chapter = chapters[activeChapter]

  if (prefersReducedMotion) {
    return <StaticHero onGetStarted={() => navigate("/login")} />
  }

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-4 pb-2 pt-2 md:px-10 md:pt-3">
      <motion.div
        className="pointer-events-none absolute left-1/2 top-4 -z-10 size-130 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl"
        style={{ opacity: glowOpacity }}
      />

      <div className="mx-auto h-[112vh] max-w-6xl md:h-[124vh]">
        <motion.div
          className="sticky top-16 flex min-h-[64vh] items-start py-1 md:min-h-[68vh]"
          style={{ scale: stageScale, y: stageY }}
        >
          <div className="grid w-full gap-8 rounded-4xl border border-emerald-300/20 bg-white/70 p-5 backdrop-blur-xl dark:bg-slate-900/55 md:grid-cols-[1.05fr_1fr] md:gap-10 md:p-8">
            <div className="text-left">
              <motion.button
                type="button"
                className="group inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-emerald-700 dark:text-emerald-200"
                initial={{ y: -14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 230, damping: 24 }}
              >
                <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">NEW</span>
                <span className="flex items-center gap-1 text-sm font-medium">
                  Scroll through your fitness story
                  <ChevronRightIcon size={16} className="transition group-hover:translate-x-0.5" />
                </span>
              </motion.button>

              <div className="mt-7 flex items-center gap-3">
                {chapters.map((item, index) => (
                  <div key={item.eyebrow} className="flex items-center gap-3">
                    <motion.span
                      className="h-1.5 w-8 rounded-full"
                      animate={{
                        backgroundColor: index <= activeChapter ? "rgba(16, 185, 129, 1)" : "rgba(148, 163, 184, 0.35)",
                        opacity: index === activeChapter ? 1 : 0.8,
                      }}
                    />
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={chapter.eyebrow}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="mt-7 text-xs font-semibold tracking-[0.22em] text-emerald-600 dark:text-emerald-300">
                    {chapter.eyebrow}
                  </p>

                  <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">
                    {chapter.title}
                  </h1>

                  <p className="mt-5 max-w-xl text-slate-600 dark:text-slate-300">{chapter.description}</p>

                  <div className="mt-7 flex flex-wrap gap-4">
                    {chapter.bullets.map((item, index) => (
                      <motion.p
                        key={item}
                        className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
                        initial={{ y: 12, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05, duration: 0.22 }}
                      >
                        <CheckIcon className="size-4 text-emerald-500" />
                        {item}
                      </motion.p>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="rounded-full bg-emerald-600 px-6 py-2.5 font-semibold text-white transition hover:bg-emerald-700"
                    >
                      {chapter.cta}
                    </button>
                    <button className="flex items-center gap-2 rounded-full border border-slate-300 px-6 py-2.5 font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                      <VideoIcon strokeWidth={1.5} />
                      Watch demo
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.div
              className="relative overflow-hidden rounded-3xl border border-emerald-200/35 bg-linear-to-br from-emerald-50/70 via-white/70 to-teal-50/60 p-2 dark:border-emerald-900/60 dark:from-emerald-950/45 dark:via-slate-900/65 dark:to-teal-950/45"
              animate={{
                scale: activeChapter === chapters.length - 1 ? 1 : 0.985,
                opacity: activeChapter === 0 ? 0.95 : 1,
              }}
              transition={{ duration: 0.35 }}
            >
              <TiltImage rotateAmplitude={activeChapter >= 2 ? 2.4 : 4} />
            </motion.div>
          </div>
        </motion.div>
      </div>

    </section>
  )
}