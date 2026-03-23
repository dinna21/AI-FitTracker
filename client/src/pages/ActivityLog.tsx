import { useState } from "react"
import { useAppContext } from "../context/AppContext"
import api from "../assets/api"
import {
  Activity, Plus, Trash2, X,
  Loader2, Clock, Flame,
  PersonStanding, Bike, Waves, Dumbbell,
  Wind, Zap, Timer,
} from "lucide-react"
import toast from "react-hot-toast"
import { quickActivities } from "../assets/assets"
import type { ActivityEntry } from "../types"

const activityIconMap: Record<string, React.ElementType> = {
  Walking: PersonStanding, Running: Wind, Cycling: Bike,
  Swimming: Waves, Yoga: Activity, "Weight Training": Dumbbell,
}
function getActivityIcon(name: string): React.ElementType {
  for (const key of Object.keys(activityIconMap))
    if (name.toLowerCase().includes(key.toLowerCase())) return activityIconMap[key]
  return Zap
}
const activityColors: Record<string, string> = {
  Walking:           "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
  Running:           "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
  Cycling:           "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
  Swimming:          "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  Yoga:              "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  "Weight Training": "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
}
function getActivityColor(name: string): string {
  for (const key of Object.keys(activityColors))
    if (name.toLowerCase().includes(key.toLowerCase())) return activityColors[key]
  return "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
}

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
      <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{text}</span>
    </div>
  )
}

const ActivityLog = () => {
  const { allActivityLogs, setAllActivityLogs, user } = useAppContext()
  const [showForm, setShowForm]     = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm]             = useState({ name: "", duration: "", calories: "" })

  const today        = new Date().toISOString().split("T")[0]
  const todayLogs    = allActivityLogs.filter((a) => a.date === today)
  const totalBurned  = todayLogs.reduce((s, a) => s + a.calories, 0)
  const totalMinutes = todayLogs.reduce((s, a) => s + a.duration, 0)
  const burnTarget   = user?.dailyCalorieBurn ?? 400
  const burnPct      = Math.min((totalBurned / burnTarget) * 100, 100)
  const isOver       = totalBurned > burnTarget
  const formatDuration = (min: number) => min >= 60 ? `${Math.floor(min / 60)}h ${min % 60}m` : `${min}m`
  const estimateCalories = (name: string, dur: number) => {
    const match = quickActivities.find((q) => name.toLowerCase().includes(q.name.toLowerCase()))
    return match ? Math.round(match.rate * dur) : Math.round(6 * dur)
  }
  const handleQuickAdd = (activityName: string) => {
    setForm((p) => ({ ...p, name: activityName, calories: p.duration ? String(estimateCalories(activityName, Number(p.duration))) : "" }))
    setShowForm(true)
  }
  const handleDurationChange = (val: string) => {
    const dur = Number(val)
    setForm((p) => ({ ...p, duration: val, calories: form.name && dur > 0 ? String(estimateCalories(form.name, dur)) : "" }))
  }
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.duration || !form.calories) { toast.error("Please fill all fields"); return }
    setSubmitting(true)
    try {
      const { data } = await api.activityLogs.create({ data: { name: form.name, duration: Number(form.duration), calories: Number(form.calories) } })
      setAllActivityLogs((prev: ActivityEntry[]) => [...prev, data])
      setForm({ name: "", duration: "", calories: "" }); setShowForm(false); toast.success("Activity logged")
    } catch { toast.error("Failed to add activity") } finally { setSubmitting(false) }
  }
  const handleDelete = async (documentId: string) => {
    setDeletingId(documentId)
    try {
      await api.activityLogs.delete(documentId)
      setAllActivityLogs((prev: ActivityEntry[]) => prev.filter((a) => a.documentId !== documentId))
      toast.success("Activity removed")
    } catch { toast.error("Failed to delete") } finally { setDeletingId(null) }
  }

  return (
    <div className="page-container">

      {/* HEADER */}
      <div className="page-header">
        <div className="flex items-start justify-between max-w-5xl mx-auto mb-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Today</p>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Activity Log</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Track your workouts</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-0.5">Active Today</p>
            <p className={`text-xl font-bold leading-none ${isOver ? "text-rose-500" : "text-emerald-500"}`}>
              {formatDuration(totalMinutes)}
            </p>
          </div>
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-1.5">
            <span className={`text-[11px] font-semibold ${isOver ? "text-rose-500" : "text-emerald-500"}`}>
              {isOver ? `${totalBurned - burnTarget} kcal over goal` : `${burnTarget - totalBurned} kcal to burn`}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">Goal: {burnTarget.toLocaleString()} kcal</span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${isOver ? "bg-rose-500" : "bg-emerald-500"}`} style={{ width: `${burnPct}%` }} />
          </div>
        </div>
      </div>

      {/* CONTENT
          Mobile : single column
          Desktop: LEFT = Quick Add + Form + chips | RIGHT = Today's Activities  */}
      <div className="px-4 py-5 max-w-5xl mx-auto lg:px-6 lg:pt-6 lg:pb-10">
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-5 lg:items-start">

          {/* ── LEFT ── */}
          <div className="flex flex-col gap-4">

            {/* Quick Add card */}
            <Card className="p-4">
              <Label icon={Activity} text="Quick Add" iconClass="text-emerald-500" />
              <div className="flex flex-wrap gap-2 mb-4">
                {quickActivities.map((q) => {
                  const QIcon = activityIconMap[q.name] ?? Zap
                  const sel   = form.name === q.name && showForm
                  return (
                    <button type="button" key={q.name} onClick={() => handleQuickAdd(q.name)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200
                        ${sel
                          ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-400 text-emerald-600 dark:text-emerald-400"
                          : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                        }`}>
                      <QIcon size={12} />{q.name}
                    </button>
                  )
                })}
              </div>
              <button type="button" onClick={() => setShowForm((p) => !p)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-sm font-semibold transition-all shadow-sm shadow-emerald-500/25">
                <Plus size={15} /> Add Custom Activity
              </button>
            </Card>

            {/* Add form */}
            {showForm && (
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <Label icon={Plus} text="New Activity" iconClass="text-emerald-500" />
                  <button title="Close Form" type="button" onClick={() => setShowForm(false)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all -mt-3">
                    <X size={14} />
                  </button>
                </div>
                <form onSubmit={handleAdd} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Activity Name</label>
                    <input type="text" placeholder="e.g. Morning Run" value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="login-input" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Duration (min)</label>
                      <input type="number" placeholder="e.g. 30" value={form.duration} min={1}
                        onChange={(e) => handleDurationChange(e.target.value)} className="login-input" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Calories Burned</label>
                      <input type="number" placeholder="e.g. 250" value={form.calories} min={1}
                        onChange={(e) => setForm((p) => ({ ...p, calories: e.target.value }))} className="login-input" />
                    </div>
                  </div>
                  {form.name && form.duration && (
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Zap size={10} className="text-emerald-400" />
                      Calories auto-estimated based on activity type
                    </p>
                  )}
                  <button type="submit" disabled={submitting}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm shadow-emerald-500/25">
                    {submitting ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : "Save Activity"}
                  </button>
                </form>
              </Card>
            )}

            {/* Summary chips */}
            {todayLogs.length > 0 && (
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { label: "Activities",  value: todayLogs.length.toString(),  unit: "",     icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                  { label: "Active Time", value: formatDuration(totalMinutes), unit: "",     icon: Timer,    color: "text-sky-500",     bg: "bg-sky-50 dark:bg-sky-500/10"          },
                  { label: "Burned",      value: totalBurned.toString(),       unit: "kcal", icon: Flame,    color: "text-rose-500",    bg: "bg-rose-50 dark:bg-rose-500/10"        },
                ].map(({ label, value, unit, icon: Icon, color, bg }) => (
                  <div key={label} className={`${bg} rounded-xl py-3.5 px-2 flex flex-col items-center gap-1`}>
                    <Icon size={14} className={color} />
                    <span className="text-base font-bold text-slate-800 dark:text-white leading-none">{value}</span>
                    {unit && <span className="text-[9px] text-slate-400 -mt-0.5">{unit}</span>}
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 text-center leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT — Today's Activities ── */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                  <Activity size={15} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Today's Activities</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{todayLogs.length} logged</p>
                </div>
              </div>
              {totalBurned > 0 && (
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-500">{totalBurned}<span className="text-[10px] font-normal text-slate-400 ml-0.5">kcal</span></p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">burned</p>
                </div>
              )}
            </div>

            {todayLogs.length === 0 ? (
              <div className="flex flex-col items-center py-14 gap-3 text-center">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                  <Activity size={22} className="text-emerald-400" />
                </div>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">No activities logged</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[180px] leading-relaxed">
                  Use Quick Add or add a custom activity
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50 dark:divide-slate-800">
                {todayLogs.map((item) => {
                  const Icon     = getActivityIcon(item.name)
                  const colorCls = getActivityColor(item.name)
                  const timeStr  = item.createdAt
                    ? new Date(item.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                    : ""
                  return (
                    <div key={item.id}
                      className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colorCls}`}>
                        <Icon size={15} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{item.name}</p>
                        {timeStr && <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{timeStr}</p>}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-end gap-1">
                            <Clock size={10} className="text-slate-400" />{item.duration} min
                          </p>
                          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                            {item.calories}<span className="text-[10px] font-normal text-slate-400 ml-0.5">kcal</span>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => item.documentId && handleDelete(item.documentId)}
                          disabled={deletingId === item.documentId}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 dark:text-slate-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50">
                          {deletingId === item.documentId ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                        </button>
                      </div>
                    </div>
                  )
                })}
                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/40">
                  <div className="flex items-center gap-2">
                    <Timer size={13} className="text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Active Time</span>
                  </div>
                  <span className="text-sm font-bold text-emerald-500">{formatDuration(totalMinutes)}</span>
                </div>
              </div>
            )}
          </Card>

        </div>
      </div>
    </div>
  )
}

export default ActivityLog