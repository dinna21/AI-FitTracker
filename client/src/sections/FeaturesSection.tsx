import { ArrowUpRight, Gauge, ShieldCheck, Sparkles } from "lucide-react"
import { motion } from "motion/react"
import SectionTitle from "../components/landing/SectionTitle"
import { featuresData } from "../data/landing/features"

const icons = [Gauge, ShieldCheck, Sparkles]

export default function FeaturesSection() {
	return (
		<section id="features" className="px-4 md:px-10">
			<div className="mx-auto max-w-6xl">
				<SectionTitle
					title="Track smarter. Stay consistent. See real results."
					subtitle="Everything you need to monitor your meals, activities, and daily progress in one place."
				/>

				<div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
					{featuresData.map((feature, index) => {
						const Icon = icons[index] ?? Sparkles
						return (
							<motion.div
								key={feature.title}
								className={index === 1 ? "rounded-2xl bg-linear-to-br from-emerald-500/35 to-slate-700/40 p-px" : ""}
								initial={{ y: 34, opacity: 0 }}
								whileInView={{ y: 0, opacity: 1 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.08, type: "spring", stiffness: 240, damping: 24 }}
							>
								<article className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
									<div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
										<Icon size={20} />
									</div>
									<h3 className="text-lg font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
									<p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{feature.description}</p>
								</article>
							</motion.div>
						)
					})}
				</div>

				<div className="relative mx-auto mt-28 max-w-5xl">
					<div className="absolute -left-24 -top-12 -z-10 size-96 rounded-full bg-emerald-500/20 blur-3xl" />

					{/* <motion.p
						className="max-w-3xl text-left text-lg text-slate-600 dark:text-slate-300"
						initial={{ y: 40, opacity: 0 }}
						whileInView={{ y: 0, opacity: 1 }}
						viewport={{ once: true }}
						transition={{ type: "spring", stiffness: 220, damping: 24 }}
					>
						FitTracker helps you understand your daily habits by tracking calories, activities, and consistency — so you can make better health decisions every day.
					</motion.p> */}

					<div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
						<motion.div
							className="md:col-span-2"
							initial={{ y: 40, opacity: 0 }}
							whileInView={{ y: 0, opacity: 1 }}
							viewport={{ once: true }}
							transition={{ type: "spring", stiffness: 220, damping: 24 }}
						>
							<img
								className="h-full w-full rounded-3xl border border-emerald-500/30 object-cover shadow-xl shadow-emerald-500/10"
								src="/images/featured.png"   // 👈 replace with your generated image
								alt="Health score dashboard preview"
								loading="lazy"
							/>
						</motion.div>

						<motion.div
							className="md:col-span-1"
							initial={{ y: 40, opacity: 0 }}
							whileInView={{ y: 0, opacity: 1 }}
							viewport={{ once: true }}
							transition={{ delay: 0.08, type: "spring", stiffness: 220, damping: 24 }}
						>
							<img
								src="/images/featured2.png"  // 👈 replace with your generated image
								alt="Goal tracking and progress preview"
								loading="lazy"
								className="h-60 w-full rounded-2xl border border-slate-200 object-cover transition duration-300 hover:-translate-y-0.5 dark:border-slate-800"
							/>

							<h3 className="mt-6 text-2xl font-semibold text-slate-800 dark:text-slate-100">
								Build better habits with clear insights
							</h3>

							<p className="mt-2 text-slate-600 dark:text-slate-300">
								Track what you eat, monitor your activity, and stay consistent with simple tools designed to keep you on track.
							</p>

							<a
								href="#pricing"
								className="group mt-4 inline-flex items-center gap-2 font-semibold text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-300"
							>
								Start tracking today
								<ArrowUpRight className="size-5 transition duration-300 group-hover:translate-x-0.5" />
							</a>
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	)
}