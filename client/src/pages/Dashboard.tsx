import { useMemo } from "react"
import { motion } from "framer-motion"
import CaloriesChart from "../components/CaloriesChart"
import { useAppContext } from "../context/AppContext"
import {
  Flame, Utensils, Zap, TrendingUp, Plus,
  Activity, Scale, Ruler, Target, Heart,
  ChevronRight, Calendar, User, BarChart3,
  ArrowUp, ArrowDown, Minus, Award,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
  dummyFoodLogs,
  dummyActivityLogs,
  getMotivationalMessage,
  goalLabels,
  ageRanges,
  mealColors,
  mealIcons,
} from "../assets/assets"

/* ─────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────── */
function getDefaultTargets(age: number) {
  const range = ageRanges.find((r) => age <= r.max) ?? ageRanges[ageRanges.length - 1]
  return { intake: range.maintain, burn: range.burn }
}

function calcBMI(weight: number, heightCm: number) {
  const h = heightCm / 100
  return parseFloat((weight / (h * h)).toFixed(1))
}

function getBMICategory(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "text-sky-500",     fill: "#38bdf8", track: "#e0f2fe" }
  if (bmi < 25)   return { label: "Healthy",     color: "text-emerald-500", fill: "#10b981", track: "#d1fae5" }
  if (bmi < 30)   return { label: "Overweight",  color: "text-amber-500",   fill: "#f59e0b", track: "#fef3c7" }
  return              { label: "Obese",          color: "text-rose-500",    fill: "#f43f5e", track: "#ffe4e6" }
}

/* ── Arc ring ── */
function Ring({ value, max, size = 96, strokeW = 8, color = "#10b981" }: {
  value: number; max: number; size?: number; strokeW?: number; color?: string
}) {
  const r    = (size - strokeW) / 2
  const circ = 2 * Math.PI * r
  const pct  = Math.min(value / max, 1)
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }} className="shrink-0">
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke="currentColor" strokeWidth={strokeW}
        className="text-slate-100 dark:text-slate-800" />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={strokeW}
        strokeDasharray={`${pct * circ} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1s cubic-bezier(.4,0,.2,1)" }} />
    </svg>
  )
}

/* ── Progress bar ── */
function Bar({ pct, color, over }: { pct: number; color: string; over?: boolean }) {
  return (
    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
      <div
        style={{ width: `${Math.min(pct, 100)}%`, transition: "width 0.8s cubic-bezier(.4,0,.2,1)" }}
        className={`h-full rounded-full ${over ? "bg-rose-500" : color}`}
      />
    </div>
  )
}

/* ── Card wrapper ── */
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
      {children}
    </div>
  )
}

/* ── Section label ── */
function Label({ icon: Icon, text, iconClass = "text-slate-400 dark:text-slate-500" }: {
  icon: React.ElementType; text: string; iconClass?: string
}) {
  return (
    <div className="flex items-center gap-1.5 mb-4">
      <Icon size={13} className={iconClass} />
      <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        {text}
      </span>
    </div>
  )
}

/* ── Calorie progress status badge ── */
function StatusBadge({ pct, over }: { pct: number; over: boolean }) {
  if (over) return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-100 dark:border-rose-500/20">
      <ArrowUp size={8} /> Over Budget
    </span>
  )
  if (pct >= 75) return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-500/20">
      <TrendingUp size={8} /> On Track
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
      In Progress
    </span>
  )
}

/* ── 7-day activity dot strip ── */
function WeekDayDots({ weekStats }: {
  weekStats: Array<{ day: string; isToday: boolean; calories: number; burned: number }>
}) {
  return (
    <div className="flex items-center justify-between px-1 mb-4">
      {weekStats.map((d) => {
        const active = d.calories > 0 || d.burned > 0
        return (
          <div key={d.day} className="flex flex-col items-center gap-1.5">
            <span className={`text-[10px] font-bold ${d.isToday ? "text-violet-500" : "text-slate-400 dark:text-slate-500"}`}>
              {d.day}
            </span>
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              d.isToday
                ? "bg-violet-500 ring-2 ring-violet-200 dark:ring-violet-500/30 shadow-sm shadow-violet-400/50"
                : active
                ? "bg-emerald-400 shadow-sm shadow-emerald-400/40"
                : "bg-slate-200 dark:bg-slate-700"
            }`} />
          </div>
        )
      })}
    </div>
  )
}

/* ── Framer-motion stagger variants ── */
const containerVariants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.07 } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
}

/* ─────────────────────────────────────────────────────
   DASHBOARD
───────────────────────────────────────────────────── */
const Dashboard = () => {
  const { user, allFoodLogs, allActivityLogs } = useAppContext()
  const navigate = useNavigate()

  const today = new Date().toISOString().split("T")[0]

  const foodLogs     = allFoodLogs.length     ? allFoodLogs     : dummyFoodLogs
  const activityLogs = allActivityLogs.length ? allActivityLogs : dummyActivityLogs

  const todayFood     = foodLogs.filter((f) => f.date === today)
  const todayActivity = activityLogs.filter((a) => a.date === today)

  const caloriesConsumed = todayFood.reduce((s, f) => s + f.calories, 0)
  const caloriesBurned   = todayActivity.reduce((s, a) => s + a.calories, 0)
  const activeMinutes    = todayActivity.reduce((s, a) => s + a.duration, 0)
  const netCalories      = caloriesConsumed - caloriesBurned

  /* week */
  const weekStats = useMemo(() => {
    const days: string[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i)
      days.push(d.toISOString().split("T")[0])
    }
    return days.map((d) => {
      const fLog = foodLogs.filter((f) => f.date === d)
      const aLog = activityLogs.filter((a) => a.date === d)
      return {
        day:     new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" }),
        isToday: d === today,
        calories: fLog.reduce((s, f) => s + f.calories, 0),
        burned:   aLog.reduce((s, a) => s + a.calories, 0),
        meals:    fLog.length,
        active:   aLog.reduce((s, a) => s + a.duration, 0),
      }
    })
  }, [foodLogs, activityLogs, today])

  const weekTotalCal    = weekStats.reduce((s, d) => s + d.calories, 0)
  const weekTotalBurned = weekStats.reduce((s, d) => s + d.burned,   0)
  const weekTotalMeals  = weekStats.reduce((s, d) => s + d.meals,    0)
  const weekTotalActive = weekStats.reduce((s, d) => s + d.active,   0)

  /* targets */
  const targets = useMemo(() => {
    if (user?.dailyCalorieIntake && user?.dailyCalorieBurn)
      return { intake: user.dailyCalorieIntake, burn: user.dailyCalorieBurn }
    return getDefaultTargets(user?.age ?? 30)
  }, [user])

  /* bmi */
  const bmiVal = user?.weight && user?.height ? calcBMI(user.weight, user.height) : null
  const bmiCat = bmiVal ? getBMICategory(bmiVal) : null
  const bmiPct = bmiVal ? Math.min(((bmiVal - 10) / 30) * 100, 100) : 0

  /* misc */
  const motivation  = getMotivationalMessage(caloriesConsumed, activeMinutes, targets.intake)
  const goalLabel   = goalLabels[(user?.goal as keyof typeof goalLabels) ?? "maintain"]
  const displayName = user?.username ?? "there"

  const hour     = new Date().getHours()
  const greeting = hour < 5 ? "Good night" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

  const intakePct = (caloriesConsumed / targets.intake) * 100
  const burnPct   = (caloriesBurned   / targets.burn)   * 100

  const netIcon = netCalories > 0 ? ArrowUp : netCalories < 0 ? ArrowDown : Minus
  const NetIcon = netIcon

  /* active days this week — derived from existing weekStats */
  const activeDaysThisWeek = weekStats.filter(d => d.calories > 0 || d.burned > 0).length

  return (
    <div className="page-container">

      {/* ══════ HEADER ══════ */}
      <div className="dashboard-header relative overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-8 w-40 h-40 bg-emerald-300/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-28 h-28 bg-teal-300/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-emerald-200/70 text-[11px] font-semibold tracking-widest uppercase mb-1.5 flex items-center gap-2">
                {greeting}
                <span className="inline-flex items-center gap-1 bg-white/15 border border-white/15 text-white/80 text-[9px] font-bold px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  Today
                </span>
              </p>
              <h1 className="text-white text-[1.75rem] font-bold tracking-tight leading-none">
                {displayName}
              </h1>
              <p className="text-emerald-100/50 text-xs mt-2 font-medium">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
            </div>

            {/* Avatar + active-days badge */}
            <div className="flex flex-col items-end gap-2">
              <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 backdrop-blur-sm">
                <span className="text-white font-bold text-base">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              {activeDaysThisWeek > 0 && (
                <div className="flex items-center gap-1 bg-white/15 border border-white/15 rounded-full px-2 py-0.5">
                  <Award size={9} className="text-amber-300" />
                  <span className="text-[9px] font-bold text-white/80">
                    {activeDaysThisWeek}d active
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Goal pill */}
          <div className="flex items-center gap-2 mb-3.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-white/12 text-white px-3 py-1.5 rounded-full border border-white/15">
              <Target size={10} />
              {goalLabel}
            </span>
          </div>

          {/* Motivation */}
          <div className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
              <Activity size={14} className="text-white" />
            </div>
            <p className="text-white/85 text-sm leading-snug">{motivation.text}</p>
          </div>

          {/* Today's quick-stats pill strip */}
          <div className="flex items-center gap-2 mt-3.5 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white/10 border border-white/10 rounded-full px-3 py-1.5">
              <Utensils size={9} className="text-emerald-300" />
              <span className="text-[11px] text-white/80 font-semibold">{caloriesConsumed} kcal in</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 border border-white/10 rounded-full px-3 py-1.5">
              <Flame size={9} className="text-orange-300" />
              <span className="text-[11px] text-white/80 font-semibold">{caloriesBurned} kcal out</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 border border-white/10 rounded-full px-3 py-1.5">
              <NetIcon size={9} className="text-white/80" />
              <span className="text-[11px] text-white/80 font-semibold">{Math.abs(netCalories)} net</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════ CONTENT ══════ */}
      <motion.div
        className="px-4 pt-5 pb-8 space-y-4 lg:grid lg:grid-cols-2 lg:gap-5 lg:space-y-0 lg:px-6 lg:max-w-5xl lg:mx-auto lg:pt-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >

        {/* ── TODAY'S SUMMARY ── */}
        <motion.div variants={cardVariants} className="lg:col-span-2">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <Label icon={Calendar} text="Today's Summary" />
              <StatusBadge pct={intakePct} over={caloriesConsumed > targets.intake} />
            </div>

            {/* Dual-ring hero */}
            <div className="flex items-center justify-around py-5 mb-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
              {/* Intake ring */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <Ring value={caloriesConsumed} max={targets.intake} size={84} strokeW={7} color="#10b981" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-sm font-bold text-slate-800 dark:text-white">{Math.round(intakePct)}%</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Intake</p>
                  <p className="text-xs font-bold text-emerald-500">
                    {caloriesConsumed} <span className="text-[9px] font-normal text-slate-400">kcal</span>
                  </p>
                </div>
              </div>

              {/* Net center */}
              <div className="flex flex-col items-center gap-1 px-2">
                <span className={`text-2xl font-bold tabular-nums leading-none ${
                  netCalories > targets.intake * 0.2 ? "text-rose-500"
                  : netCalories < 0 ? "text-emerald-500"
                  : "text-slate-700 dark:text-slate-200"
                }`}>
                  {Math.abs(netCalories)}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">net kcal</span>
                <span className={`text-[10px] font-bold flex items-center gap-0.5 ${
                  netCalories > 0 ? "text-rose-400" : netCalories < 0 ? "text-emerald-500" : "text-slate-400"
                }`}>
                  <NetIcon size={9} />
                  {netCalories > 0 ? "surplus" : netCalories < 0 ? "deficit" : "balanced"}
                </span>
              </div>

              {/* Burn ring */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <Ring value={caloriesBurned} max={targets.burn} size={84} strokeW={7} color="#f97316" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-sm font-bold text-slate-800 dark:text-white">{Math.round(burnPct)}%</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Burned</p>
                  <p className="text-xs font-bold text-orange-500">
                    {caloriesBurned} <span className="text-[9px] font-normal text-slate-400">kcal</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Calories In */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                      <Utensils size={11} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Calories In</span>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    <span className="font-bold text-slate-700 dark:text-slate-200">{caloriesConsumed}</span>
                    {" / "}{targets.intake} kcal
                  </span>
                </div>
                <Bar pct={intakePct} color="bg-emerald-500" over={caloriesConsumed > targets.intake} />
                <div className="flex justify-between mt-1">
                  <span className={`text-[11px] font-semibold ${caloriesConsumed > targets.intake ? "text-rose-500" : "text-emerald-500"}`}>
                    {caloriesConsumed > targets.intake
                      ? `${caloriesConsumed - targets.intake} kcal over`
                      : `${targets.intake - caloriesConsumed} kcal remaining`}
                  </span>
                  <span className="text-[11px] text-slate-400">{Math.round(intakePct)}%</span>
                </div>
              </div>

              {/* Calories Burned */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
                      <Flame size={11} className="text-orange-500" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Calories Burned</span>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    <span className="font-bold text-slate-700 dark:text-slate-200">{caloriesBurned}</span>
                    {" / "}{targets.burn} kcal
                  </span>
                </div>
                <Bar pct={burnPct} color="bg-orange-500" />
                <div className="flex justify-between mt-1">
                  <span className="text-[11px] font-semibold text-orange-500">
                    {caloriesBurned >= targets.burn ? "Goal reached 🎉" : `${targets.burn - caloriesBurned} kcal to go`}
                  </span>
                  <span className="text-[11px] text-slate-400">{Math.round(burnPct)}%</span>
                </div>
              </div>

              {/* Net strip */}
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${netCalories > 0 ? "bg-blue-50 dark:bg-blue-500/10" : "bg-emerald-50 dark:bg-emerald-500/10"}`}>
                  <NetIcon size={13} className={netCalories > 0 ? "text-blue-500" : "text-emerald-500"} />
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex-1">Net Calories</span>
                <span className={`text-sm font-bold ${netCalories > targets.intake ? "text-rose-500" : "text-slate-700 dark:text-slate-200"}`}>
                  {netCalories} <span className="text-[10px] font-normal text-slate-400">kcal</span>
                </span>
              </div>
            </div>

            {/* Stat trio */}
            <div className="grid grid-cols-3 gap-2.5 mt-5">
              {[
                { label: "Meals",      value: todayFood.length,     icon: Utensils, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                { label: "Active min", value: activeMinutes,         icon: Zap,      color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10"   },
                { label: "Workouts",   value: todayActivity.length, icon: Activity, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-500/10"   },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className={`${bg} rounded-xl py-3.5 px-2 flex flex-col items-center gap-1.5`}>
                  <Icon size={14} className={color} />
                  <span className="text-lg font-bold text-slate-800 dark:text-white leading-none">{value}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 text-center leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* ── THIS WEEK ── */}
        <motion.div variants={cardVariants} className="lg:col-span-2">
          <Card className="p-5">
            <div className="flex items-start justify-between mb-3">
              <Label icon={BarChart3} text="This Week" iconClass="text-violet-400" />
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium -mt-0.5">Last 7 days</span>
            </div>

            {/* 7-day dot strip */}
            <WeekDayDots weekStats={weekStats} />

            {/* Recharts bar chart */}
            <CaloriesChart />

            {/* Week summary 2×2 */}
            <div className="grid grid-cols-2 gap-2.5 mt-4">
              {[
                { label: "Total Calories", value: weekTotalCal.toLocaleString(),    unit: "kcal",  icon: Utensils, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                { label: "Total Burned",   value: weekTotalBurned.toLocaleString(), unit: "kcal",  icon: Flame,    color: "text-orange-500",  bg: "bg-orange-50 dark:bg-orange-500/10"  },
                { label: "Meals Logged",   value: weekTotalMeals.toString(),         unit: "meals", icon: Calendar, color: "text-blue-500",    bg: "bg-blue-50 dark:bg-blue-500/10"      },
                {
                  label: "Active Time",
                  value: weekTotalActive >= 60
                    ? `${Math.floor(weekTotalActive / 60)}h ${weekTotalActive % 60}m`
                    : `${weekTotalActive}m`,
                  unit: "",
                  icon: Zap,
                  color: "text-violet-500",
                  bg: "bg-violet-50 dark:bg-violet-500/10",
                },
              ].map(({ label, value, unit, icon: Icon, color, bg }) => (
                <div key={label} className={`${bg} rounded-xl p-3.5 flex items-center gap-3`}>
                  <div className="w-8 h-8 rounded-lg bg-white/60 dark:bg-slate-900/50 flex items-center justify-center shrink-0">
                    <Icon size={14} className={color} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{label}</p>
                    <p className={`text-sm font-bold ${color} leading-tight`}>
                      {value}{unit ? <span className="text-[10px] font-normal text-slate-400 ml-0.5">{unit}</span> : null}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* ── BMI ── */}
        {bmiVal && bmiCat && (
          <motion.div variants={cardVariants}>
            <Card className="p-5">
              <Label icon={Heart} text="BMI" iconClass="text-rose-400" />

              <div className="flex items-center gap-4 mb-5">
                <div className="relative shrink-0">
                  <Ring value={bmiVal - 10} max={30} size={88} color={bmiCat.fill} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-bold text-slate-800 dark:text-white leading-none">{bmiVal}</span>
                  </div>
                </div>
                <div>
                  <p className={`text-base font-bold ${bmiCat.color}`}>{bmiCat.label}</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">
                    Healthy range<br />
                    <span className="font-semibold text-slate-500 dark:text-slate-400">18.5 – 24.9</span>
                  </p>
                </div>
              </div>

              {/* Gradient scale */}
              <div className="relative">
                <div className="h-2.5 rounded-full overflow-hidden flex">
                  <div className="flex-1 bg-sky-400" />
                  <div className="flex-1 bg-emerald-400" />
                  <div className="flex-1 bg-amber-400" />
                  <div className="flex-1 bg-rose-400" />
                </div>
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 shadow-md transition-all duration-700"
                  style={{ left: `calc(${bmiPct}% - 8px)`, borderColor: bmiCat.fill }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                {["Under", "Normal", "Over", "Obese"].map((l) => (
                  <span key={l} className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">{l}</span>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* ── PROFILE ── */}
        <motion.div variants={cardVariants}>
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <User size={13} className="text-amber-400" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Your Profile
                </span>
              </div>
              <button
                onClick={() => navigate("/profile")}
                className="text-[10px] font-bold text-amber-500 hover:text-amber-600 transition-colors flex items-center gap-0.5"
              >
                Edit <ChevronRight size={10} />
              </button>
            </div>

            <div className="space-y-1">
              {[
                { label: "Weight",        value: user?.weight ? `${user.weight} kg`  : "—", icon: Scale,    color: "text-amber-500",   bg: "bg-amber-50 dark:bg-amber-500/10"   },
                { label: "Height",        value: user?.height ? `${user.height} cm`  : "—", icon: Ruler,    color: "text-sky-500",     bg: "bg-sky-50 dark:bg-sky-500/10"       },
                { label: "Age",           value: user?.age    ? `${user.age} yrs`    : "—", icon: Calendar, color: "text-violet-500",  bg: "bg-violet-50 dark:bg-violet-500/10"   },
                { label: "Goal",          value: goalLabel,                                  icon: Target,   color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                { label: "Intake Target", value: `${targets.intake} kcal`,                  icon: Utensils, color: "text-teal-500",    bg: "bg-teal-50 dark:bg-teal-500/10"     },
                { label: "Burn Target",   value: `${targets.burn} kcal`,                    icon: Flame,    color: "text-rose-500",    bg: "bg-rose-50 dark:bg-rose-500/10"     },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
                    <Icon size={13} className={color} />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex-1">{label}</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* ── TODAY'S MEALS ── */}
        <motion.div variants={cardVariants} className="lg:col-span-2">
          <Card className="p-5">
            <div className="flex items-start justify-between mb-4">
              <Label icon={Utensils} text="Today's Meals" />
              <button
                onClick={() => navigate("/food")}
                className="flex items-center gap-1.5 text-xs bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-emerald-600 active:scale-95 transition-all shadow-sm shadow-emerald-500/30 -mt-0.5"
              >
                <Plus size={11} /> Log food
              </button>
            </div>

            {todayFood.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3 ring-4 ring-emerald-50 dark:ring-emerald-500/5">
                  <Utensils size={22} className="text-emerald-400" />
                </div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No meals logged yet</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Start tracking to see your progress</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {todayFood.slice(0, 4).map((item) => {
                  const mealType = item.mealType as keyof typeof mealColors
                  const colorCls = mealColors[mealType] ?? "bg-slate-100 text-slate-500"
                  const MealIcon = mealIcons[mealType]  ?? Utensils
                  return (
                    <div key={item.id} className="food-entry-item hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors rounded-xl px-3 py-2.5 border-l-2 border-emerald-400">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${colorCls}`}>
                          <MealIcon size={13} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">{item.name}</p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 capitalize mt-0.5">{item.mealType}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-lg">
                        {item.calories} <span className="text-[9px] font-normal text-slate-400">kcal</span>
                      </span>
                    </div>
                  )
                })}
                {todayFood.length > 4 && (
                  <button onClick={() => navigate("/food")}
                    className="flex items-center justify-center gap-1 w-full text-xs text-emerald-500 font-semibold py-2 hover:text-emerald-600 transition-colors">
                    {todayFood.length - 4} more entries <ChevronRight size={12} />
                  </button>
                )}
              </div>
            )}
          </Card>
        </motion.div>

        {/* ── RECENT ACTIVITY ── */}
        <motion.div variants={cardVariants} className="lg:col-span-2">
          <Card className="p-5">
            <div className="flex items-start justify-between mb-4">
              <Label icon={Activity} text="Recent Activity" iconClass="text-orange-400" />
              <button
                onClick={() => navigate("/activity")}
                className="flex items-center gap-1.5 text-xs bg-orange-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-orange-600 active:scale-95 transition-all shadow-sm shadow-orange-500/30 -mt-0.5"
              >
                <Plus size={11} /> Log activity
              </button>
            </div>

            {todayActivity.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 bg-orange-50 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3 ring-4 ring-orange-50 dark:ring-orange-500/5">
                  <Zap size={22} className="text-orange-400" />
                </div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No activities logged yet</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Move your body, log your effort</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {todayActivity.slice(0, 4).map((item) => (
                  <div key={item.id} className="activity-entry-item hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors rounded-xl px-3 py-2.5 border-l-2 border-orange-400">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center shrink-0">
                        <Zap size={13} className="text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">{item.name}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{item.duration} min</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-orange-500 shrink-0 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded-lg">
                      -{item.calories} <span className="text-[9px] font-normal text-slate-400">kcal</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

      </motion.div>
    </div>
  )
}

export default Dashboard