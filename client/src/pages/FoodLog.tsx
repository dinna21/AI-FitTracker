import { useState, useRef } from "react"
import { useAppContext } from "../context/AppContext"
import api from "../assets/api"
import {
  Utensils, Plus, Trash2, X,
  Coffee, Sun, Moon, Cookie, Sparkles,
  ChevronDown, ChevronUp, Loader2, Camera,
} from "lucide-react"
import toast from "react-hot-toast"
import { mealColors, mealTypeOptions, quickActivitiesFoodLog } from "../assets/assets"
import type { FoodEntry } from "../types"

/* ─── types ── */
const mealIcons = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Moon,
  snack: Cookie,
}

const mealOrder = ["breakfast", "lunch", "dinner", "snack"] as const
type MealType = typeof mealOrder[number]

/* ─── shared sub-components (same style as Dashboard) ── */
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm ${className}`}>
      {children}
    </div>
  )
}

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

/* ─────────────────────────────────────────────────────
   FOOD LOG PAGE
───────────────────────────────────────────────────── */
const FoodLog = () => {
  const { allFoodLogs, setAllFoodLogs, user } = useAppContext()

  const [showForm, setShowForm]       = useState(false)
  const [showAiForm, setShowAiForm]   = useState(false)
  const [activeFilter, setActiveFilter] = useState<MealType | "all">("all")
  const [expandedMeals, setExpandedMeals] = useState<Set<string>>(new Set(mealOrder))
  const [deletingId, setDeletingId]   = useState<string | null>(null)
  const [aiLoading, setAiLoading]     = useState(false)
  const [submitting, setSubmitting]   = useState(false)

  const [form, setForm] = useState({
    name: "",
    calories: "",
    mealType: "breakfast",
  })

  const today    = new Date().toISOString().split("T")[0]
  const todayLogs= allFoodLogs.filter((f) => f.date === today)
  const total    = todayLogs.reduce((s, f) => s + f.calories, 0)
  const target   = user?.dailyCalorieIntake ?? 2000
  const pct      = Math.min((total / target) * 100, 100)
  const isOver   = total > target

  const grouped = mealOrder.reduce((acc, meal) => {
    acc[meal] = todayLogs.filter((f) => f.mealType === meal)
    return acc
  }, {} as Record<MealType, FoodEntry[]>)

  const toggleMeal = (meal: string) => {
    setExpandedMeals((prev) => {
      const next = new Set(prev)
      next.has(meal) ? next.delete(meal) : next.add(meal)
      return next
    })
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.calories) {
      toast.error("Please fill all fields")
      return
    }
    setSubmitting(true)
    try {
      const { data } = await api.foodLogs.create({ data: { ...form, calories: Number(form.calories) } })
      setAllFoodLogs((prev) => [...prev, data])
      setForm({ name: "", calories: "", mealType: "breakfast" })
      setShowForm(false)
      toast.success("Food entry added")
    } catch {
      toast.error("Failed to add entry")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (documentId: string) => {
    setDeletingId(documentId)
    try {
      await api.foodLogs.delete(documentId)
      setAllFoodLogs((prev) => prev.filter((f) => f.documentId !== documentId))
      toast.success("Entry removed")
    } catch {
      toast.error("Failed to delete")
    } finally {
      setDeletingId(null)
    }
  }

  const handleAiSnap = async (file: File) => {
    setAiLoading(true)
    try {
      const reader = new FileReader()
      const imageBase64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string
          // Strip the data URL prefix (e.g. "data:image/jpeg;base64,")
          resolve(result.split(",")[1])
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const { data } = await api.imageAnalysis.analyze({
        imageBase64,
        mimeType: file.type || "image/jpeg",
      })
      setForm((prev) => ({ ...prev, name: data.result.name, calories: String(data.result.calories) }))
      setShowAiForm(false)
      setShowForm(true)
      toast.success(`Detected: ${data.result.name}`)
    } catch {
      toast.error("AI analysis failed")
    } finally {
      setAiLoading(false)
    }
  }

  const filtered = activeFilter === "all"
    ? mealOrder
    : mealOrder.filter((m) => m === activeFilter)

  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="page-container">

      {/* ══════ HEADER ══════ */}
      <div className="page-header">
        <div className="flex items-start justify-between mb-5 max-w-2xl mx-auto">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
              Today
            </p>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Food Log</h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-0.5">Consumed</p>
            <p className={`text-xl font-bold leading-none ${isOver ? "text-rose-500" : "text-emerald-500"}`}>
              {total.toLocaleString()}
              <span className="text-xs font-normal text-slate-400 ml-1">kcal</span>
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-1.5">
            <span className={`text-[11px] font-semibold ${isOver ? "text-rose-500" : "text-emerald-500"}`}>
              {isOver
                ? `${(total - target).toLocaleString()} kcal over`
                : `${(target - total).toLocaleString()} kcal remaining`}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Target: {target.toLocaleString()} kcal
            </span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${isOver ? "bg-rose-500" : "bg-emerald-500"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* ══════ CONTENT ══════ */}
      <div className="px-4 py-5 space-y-4 max-w-2xl mx-auto lg:px-6">

        {/* ── ACTIONS ── */}
        <Card className="p-4">
          <Label icon={Utensils} text="Add Food" iconClass="text-emerald-500" />

          {/* Meal type quick-pick */}
          <div className="flex flex-wrap gap-2 mb-4">
            {quickActivitiesFoodLog.map((q) => {
              const isActive = form.mealType === q.name && showForm
              return (
                <button
                  type="button"
                  key={q.name}
                  onClick={() => { setForm((p) => ({ ...p, mealType: q.name })); setShowForm(true); setShowAiForm(false) }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200
                    ${isActive
                      ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-400 text-emerald-600 dark:text-emerald-400"
                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                >
                  {q.name.charAt(0).toUpperCase() + q.name.slice(1)}
                </button>
              )
            })}
          </div>

          {/* CTA buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setShowForm((p) => !p); setShowAiForm(false) }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-sm font-semibold transition-all shadow-sm shadow-emerald-500/25"
            >
              <Plus size={15} /> Add Entry
            </button>
            <button
              type="button"
              onClick={() => { setShowAiForm((p) => !p); setShowForm(false) }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-600 active:scale-95 text-white text-sm font-semibold transition-all shadow-sm shadow-violet-500/25"
            >
              <Sparkles size={15} /> AI Snap
            </button>
          </div>
        </Card>

        {/* ── MANUAL FORM ── */}
        {showForm && (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Label icon={Plus} text="New Entry" iconClass="text-emerald-500" />
              <button
                title="Close Form"
                type="button"
                onClick={() => setShowForm(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-all -mt-3"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  Food Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Grilled Chicken"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="login-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 350"
                    value={form.calories}
                    min={1}
                    onChange={(e) => setForm((p) => ({ ...p, calories: e.target.value }))}
                    className="login-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                    Meal Type
                  </label>
                  <div className="relative">
                    <select
                    title="Select meal type"
                      value={form.mealType}
                      onChange={(e) => setForm((p) => ({ ...p, mealType: e.target.value }))}
                      className="login-input appearance-none pr-8"
                    >
                      {mealTypeOptions.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm shadow-emerald-500/25"
              >
                {submitting
                  ? <><Loader2 size={14} className="animate-spin" /> Saving...</>
                  : "Save Entry"
                }
              </button>
            </form>
          </Card>
        )}

        {/* ── AI SNAP ── */}
        {showAiForm && (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Label icon={Sparkles} text="AI Food Snap" iconClass="text-violet-500" />
              <button
                title="Close Form"
                type="button"
                onClick={() => setShowAiForm(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-all -mt-3"
              >
                <X size={14} />
              </button>
            </div>

            {/* Hidden file input */}
            <input
              title="Select an image file"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleAiSnap(file)
                e.target.value = "" // reset so same file can be re-selected
              }}
            />

            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center gap-3 text-center">
              <div className="w-11 h-11 rounded-2xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center">
                <Camera size={20} className="text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Snap your meal</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 leading-relaxed max-w-[200px] mx-auto">
                  AI will detect the food and estimate calories automatically
                </p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={aiLoading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-600 active:scale-95 text-white text-sm font-semibold transition-all disabled:opacity-60 shadow-sm shadow-violet-500/25"
                title="Snap Food"
              >
                {aiLoading
                  ? <><Loader2 size={14} className="animate-spin" /> Analyzing...</>
                  : <><Sparkles size={14} /> Analyze Food</>
                }
              </button>
            </div>
          </Card>
        )}

        {/* ── FILTER TABS ── */}
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {(["all", ...mealOrder] as const).map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                ${activeFilter === tab
                  ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/25"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-emerald-300 dark:hover:border-emerald-700"
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* ── MEAL GROUPS ── */}
        {filtered.map((meal) => {
          const items     = grouped[meal]
          const Icon      = mealIcons[meal]
          const colorCls  = mealColors[meal]
          const mealTotal = items.reduce((s, f) => s + f.calories, 0)
          const isExpanded= expandedMeals.has(meal)

          return (
            <Card key={meal} className="overflow-hidden">
              {/* Meal header row */}
              <button
                type="button"
                onClick={() => toggleMeal(meal)}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${colorCls}`}>
                  <Icon size={14} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200 capitalize">{meal}</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  {mealTotal > 0 && (
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      {mealTotal}
                      <span className="text-[10px] font-normal text-slate-400 ml-0.5">kcal</span>
                    </span>
                  )}
                  {isExpanded
                    ? <ChevronUp size={14} className="text-slate-400" />
                    : <ChevronDown size={14} className="text-slate-400" />
                  }
                </div>
              </button>

              {/* Expanded items */}
              {isExpanded && (
                <div className="border-t border-slate-100 dark:border-slate-800">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center py-7 gap-2">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center opacity-40 ${colorCls}`}>
                        <Icon size={15} />
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-500">No {meal} logged yet</p>
                      <button
                        type="button"
                        onClick={() => { setForm((p) => ({ ...p, mealType: meal })); setShowForm(true) }}
                        className="text-[11px] font-semibold text-emerald-500 hover:text-emerald-600 transition-colors flex items-center gap-1"
                      >
                        <Plus size={11} /> Add {meal}
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-50 dark:divide-slate-800">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                              {item.name}
                            </p>
                          </div>
                          <div className="flex items-center gap-2.5 shrink-0">
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                              {item.calories}
                              <span className="text-[10px] font-normal text-slate-400 ml-0.5">kcal</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => item.documentId && handleDelete(item.documentId)}
                              disabled={deletingId === item.documentId}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 dark:text-slate-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                            >
                              {deletingId === item.documentId
                                ? <Loader2 size={12} className="animate-spin" />
                                : <Trash2 size={12} />
                              }
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          )
        })}

        {/* ── EMPTY STATE ── */}
        {todayLogs.length === 0 && (
          <div className="flex flex-col items-center py-16 gap-3 text-center">
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center">
              <Utensils size={24} className="text-emerald-400" />
            </div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Nothing logged today</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[180px] leading-relaxed">
              Start adding meals to track your daily calorie intake
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

export default FoodLog