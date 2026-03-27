import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../context/AppContext"
import toast from "react-hot-toast"
import api from "../assets/api"
import {
  User, Dumbbell, Target, ChevronRight, ChevronLeft,
  Activity, Flame, Zap, Wind, Heart, CheckCircle2,
  Scale, Ruler, Calendar, Mars, Venus, Info
} from "lucide-react"

const steps = [
  { label: "Personal", icon: User },
  { label: "Fitness", icon: Dumbbell },
  { label: "Goals", icon: Target },
]

const activityLevels = [
  { label: "Sedentary", desc: "Little or no exercise", icon: Scale, color: "text-slate-500" },
  { label: "Lightly Active", desc: "Light exercise 1–3 days/week", icon: Wind, color: "text-blue-500" },
  { label: "Moderately Active", desc: "Moderate exercise 3–5 days/week", icon: Zap, color: "text-amber-500" },
  { label: "Very Active", desc: "Hard exercise 6–7 days/week", icon: Flame, color: "text-emerald-500" },
]

const goalOptions = [
  { label: "Lose Weight", desc: "Burn fat & slim down", icon: Flame },
  { label: "Maintain Weight", desc: "Keep your current weight", icon: Heart },
  { label: "Gain Muscle", desc: "Build strength & size", icon: Dumbbell },
]

const Onboarding = () => {
  const [step, setStep] = useState(1)
  const navigate = useNavigate()
  const { setOnboardingCompleted, setUser, user } = useAppContext()
  
  const [form, setForm] = useState({
    age: "",
    weight: "",
    height: "",
    gender: "",
    activityLevel: "",
    goal: "",
    targetWeight: "",
    dailyCalorieIntake: 2500,
    dailyCalorieBurn: 550,
  })

  const update = (key: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const next = () => {
    if (step === 1 && (!form.age || !form.weight || !form.height || !form.gender)) {
      toast.error("Please fill in all fields")
      return
    }
    if (step === 2 && !form.activityLevel) {
      toast.error("Please select your activity level")
      return
    }
    if (step < 3) setStep((s) => s + 1)
  }

  const back = () => setStep((s) => s - 1)

  const handleSubmit = async () => {
    if (!form.goal) {
      toast.error("Please select a goal")
      return
    }

    const goalMap: Record<string, string> = {
      "Lose Weight": "lose",
      "Maintain Weight": "maintain",
      "Gain Muscle": "gain",
    }

    try {
      const payload = {
        age: Number(form.age),
        weight: Number(form.weight),
        height: Number(form.height),
        gender: form.gender,
        activityLevel: form.activityLevel,
        goal: (goalMap[form.goal] ?? "maintain") as "lose" | "maintain" | "gain",
        dailyCalorieIntake: form.dailyCalorieIntake,
        dailyCalorieBurn: form.dailyCalorieBurn,
      }

      const { data } = await api.user.update(String(user?.id ?? ''), { ...payload, onboardingCompleted: true })
      setUser((prev: any) => ({ ...prev, ...data }))
      toast.success("Profile saved! Welcome to FitTrack")
      setOnboardingCompleted(true)
      navigate("/dashboard")
    } catch {
      toast.error("Failed to save profile")
    }
  }

  const progress = ((step - 1) / (steps.length - 1)) * 100

  return (
    <div>
      <div className="onboarding-container min-h-screen bg-slate-50 dark:bg-slate-900 flex items-start justify-center">
        <div className="onboarding-wrapper w-full max-w-md px-4 py-8 flex flex-col min-h-screen">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Activity size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-slate-800 dark:text-white">FitTrack</span>
          </div>

          {/* Progress */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Let's personalize your experience
              </p>
              <span className="text-xs font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full">
                {step} / {steps.length}
              </span>
            </div>

            {/* Step Labels */}
            <div className="flex items-center justify-between mb-3">
              {steps.map((s, i) => {
                const Icon = s.icon
                const done = step > i + 1
                const active = step === i + 1
                return (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300
                      ${done ? "bg-emerald-500" : active ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"}`}>
                      {done
                        ? <CheckCircle2 size={14} className="text-white" />
                        : <Icon size={12} className={active ? "text-white" : "text-slate-400 dark:text-slate-500"} />
                      }
                    </div>
                    <span className={`text-xs font-medium transition-colors duration-300
                      ${active ? "text-emerald-500" : done ? "text-emerald-400" : "text-slate-400 dark:text-slate-500"}`}>
                      {s.label}
                    </span>
                    {i < steps.length - 1 && (
                      <div className={`w-10 h-px mx-1 transition-all duration-500
                        ${done ? "bg-emerald-400" : "bg-slate-200 dark:bg-slate-700"}`} />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Progress Bar */}
            <div className="relative w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Card */}
          <div className="flex-1 flex flex-col gap-4 mt-6">

            {/* Step Header */}
            <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm">
              {(() => {
                const Icon = steps[step - 1].icon
                return (
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-emerald-500" />
                  </div>
                )
              })()}
              <div>
                <h2 className="font-bold text-slate-800 dark:text-white text-base">
                  {step === 1 && "Tell us about yourself"}
                  {step === 2 && "Your activity level"}
                  {step === 3 && "Set your fitness goal"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {step === 1 && "We use this to personalize your plan"}
                  {step === 2 && "Pick the option that best fits your lifestyle"}
                  {step === 3 && "Choose a goal and set your daily targets"}
                </p>
              </div>
            </div>

            {/* Step 1 — Personal Info */}
            {step === 1 && (
              <div className="flex flex-col gap-4 bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/50 p-5 shadow-sm">

                {/* Age */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                    <Calendar size={13} className="text-emerald-500" /> Age
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 25"
                    value={form.age}
                    onChange={(e) => update("age", e.target.value)}
                    className="login-input"
                  />
                </div>

                {/* Weight & Height */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                      <Scale size={13} className="text-emerald-500" /> Weight (kg)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 70"
                      value={form.weight}
                      onChange={(e) => update("weight", e.target.value)}
                      className="login-input"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                      <Ruler size={13} className="text-emerald-500" /> Height (cm)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 175"
                      value={form.height}
                      onChange={(e) => update("height", e.target.value)}
                      className="login-input"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 block">
                    Gender
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Male", Icon: Mars },
                      { label: "Female", Icon: Venus },
                    ].map(({ label, Icon }) => (
                      <button
                        type="button"
                        key={label}
                        onClick={() => update("gender", label)}
                        className={`onboarding-option-btn flex items-center gap-2.5 py-3 px-4 justify-center transition-all duration-200
                          ${form.gender === label
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
                            : ""
                          }`}
                      >
                        <Icon size={15} className={form.gender === label ? "text-emerald-500" : "text-slate-400"} />
                        <span className={`font-semibold text-sm ${form.gender === label ? "text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-300"}`}>
                          {label}
                        </span>
                        {form.gender === label && (
                          <CheckCircle2 size={14} className="text-emerald-500 ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 — Activity Level */}
            {step === 2 && (
              <div className="flex flex-col gap-3">
                {activityLevels.map((a) => {
                  const Icon = a.icon
                  const selected = form.activityLevel === a.label
                  return (
                    <button
                      type="button"
                      key={a.label}
                      onClick={() => update("activityLevel", a.label)}
                      className={`onboarding-option-btn flex items-center gap-4 p-4 transition-all duration-200
                        ${selected ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10" : ""}`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all
                        ${selected ? "bg-emerald-500" : "bg-slate-100 dark:bg-slate-700"}`}>
                        <Icon size={16} className={selected ? "text-white" : a.color} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`font-semibold text-sm ${selected ? "text-emerald-600 dark:text-emerald-400" : "text-slate-700 dark:text-slate-200"}`}>
                          {a.label}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{a.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                        ${selected ? "border-emerald-500 bg-emerald-500" : "border-slate-300 dark:border-slate-600"}`}>
                        {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Step 3 — Goals */}
            {step === 3 && (
              <div className="flex flex-col gap-4">
                {/* Goal Options — vertical list */}
                <div className="flex flex-col gap-3">
                  {goalOptions.map((g) => {
                    const Icon = g.icon
                    const selected = form.goal === g.label
                    return (
                      <button
                        type="button"
                        key={g.label}
                        onClick={() => update("goal", g.label)}
                        className={`onboarding-option-btn flex items-center gap-4 p-4 transition-all duration-200
                          ${selected ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10" : ""}`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all
                          ${selected ? "bg-emerald-500" : "bg-slate-100 dark:bg-slate-700"}`}>
                          <Icon size={16} className={selected ? "text-white" : "text-slate-500 dark:text-slate-400"} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`font-semibold text-sm ${selected ? "text-emerald-600 dark:text-emerald-400" : "text-slate-700 dark:text-slate-200"}`}>
                            {g.label}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{g.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                          ${selected ? "border-emerald-500 bg-emerald-500" : "border-slate-300 dark:border-slate-600"}`}>
                          {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Daily Targets */}
                <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/50 p-5 shadow-sm flex flex-col gap-5">
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm">Daily Targets</h3>

                  {/* Daily Calorie Intake */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Daily Calorie Intake</span>
                        <Info size={13} className="text-slate-400" />
                      </div>
                      <span className="text-sm font-bold text-emerald-500">{form.dailyCalorieIntake} kcal</span>
                    </div>
                    <div className="relative">
                      <input
                        title="Set your daily calorie intake target"
                        type="range"
                        min={1200}
                        max={4000}
                        step={50}
                        value={form.dailyCalorieIntake}
                        onChange={(e) => update("dailyCalorieIntake", Number(e.target.value))}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #10b981 0%, #10b981 ${((form.dailyCalorieIntake - 1200) / (4000 - 1200)) * 100}%, #e2e8f0 ${((form.dailyCalorieIntake - 1200) / (4000 - 1200)) * 100}%, #e2e8f0 100%)`
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-slate-400">1200 kcal</span>
                      <span className="text-xs text-slate-400">4000 kcal</span>
                    </div>
                  </div>

                  {/* Daily Calorie Burn */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Daily Calorie Burn</span>
                        <Info size={13} className="text-slate-400" />
                      </div>
                      <span className="text-sm font-bold text-emerald-500">{form.dailyCalorieBurn} kcal</span>
                    </div>
                    <div className="relative">
                      <input
                        title="Set your daily calorie burn target"
                        type="range"
                        min={200}
                        max={1500}
                        step={50}
                        value={form.dailyCalorieBurn}
                        onChange={(e) => update("dailyCalorieBurn", Number(e.target.value))}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #10b981 0%, #10b981 ${((form.dailyCalorieBurn - 200) / (1500 - 200)) * 100}%, #e2e8f0 ${((form.dailyCalorieBurn - 200) / (1500 - 200)) * 100}%, #e2e8f0 100%)`
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-slate-400">200 kcal</span>
                      <span className="text-xs text-slate-400">1500 kcal</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={back}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <ChevronLeft size={16} /> Back
              </button>
            )}
            <button
              type="button"
              onClick={step === 3 ? handleSubmit : next}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-200"
            >
              {step === 3 ? "Get Started" : <>Continue <ChevronRight size={16} /></>}
            </button>
          </div>

        </div>
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          border: 2px solid #10b981;
          box-shadow: 0 1px 4px rgba(16,185,129,0.4);
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          border: 2px solid #10b981;
          box-shadow: 0 1px 4px rgba(16,185,129,0.4);
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

export default Onboarding