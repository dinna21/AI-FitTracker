import { useRef, type MouseEvent } from "react"
import { motion, useSpring } from "motion/react"

type TiltImageProps = {
  rotateAmplitude?: number
}

const springValues = {
  damping: 30,
  stiffness: 110,
  mass: 1.8,
}

export default function TiltImage({ rotateAmplitude = 4 }: TiltImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const rotateX = useSpring(0, springValues)
  const rotateY = useSpring(0, springValues)

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left - rect.width / 2
    const offsetY = e.clientY - rect.top - rect.height / 2

    const nextRotateX = (offsetY / (rect.height / 2)) * -rotateAmplitude
    const nextRotateY = (offsetX / (rect.width / 2)) * rotateAmplitude

    rotateX.set(nextRotateX)
    rotateY.set(nextRotateY)
  }

  function handleMouseLeave() {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.figure
      ref={ref}
      className="mx-auto mt-14 flex w-full max-w-5xl flex-col items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ y: 70, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
    >
      <motion.div
        className="relative w-full overflow-hidden rounded-3xl border border-emerald-300/30 bg-slate-900 p-2 shadow-2xl shadow-emerald-600/10"
        style={{ rotateX, rotateY }}
      >
        <img
          src="/images/hero.png"
          className="h-105 w-full rounded-2xl object-cover"
          alt="Team collaborating around a laptop"
        />
        <div className="absolute bottom-8 left-1/2 w-[82%] -translate-x-1/2 rounded-2xl bg-emerald-500 px-5 py-4 text-white shadow-lg shadow-emerald-500/40">
          <p className="text-lg font-semibold">Used by 1,000+ fitness coaches</p>
          <p className="text-sm text-emerald-50">4.9 average rating across onboarding teams</p>
        </div>
      </motion.div>
    </motion.figure>
  )
}
