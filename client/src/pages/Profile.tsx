import { useState } from "react"
import { useAppContext } from "../context/AppContext"
import mockApi from "../assets/mockApi"
import {
  User, Scale, Ruler, Calendar, Target,
  Utensils, Activity, LogOut, Edit3, Save,
  X, Loader2, Flame, TrendingUp, ChevronDown,
  ShieldCheck,
} from "lucide-react"
import toast from "react-hot-toast"
import { goalLabels, ageRanges } from "../assets/assets"
import { useNavigate } from "react-router-dom"

/* ─── helpers ── */
function calcBMI(weight: number, heightCm: number) {
  const h = heightCm / 100
  return parseFloat((weight / (h * h)).toFixed(1))
}

function getBMICategory(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "text-sky-500",     bg: "bg-sky-50 dark:bg-sky-500/10"         }
  if (bmi < 25)   return { label: "Healthy",     color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10"  }
  if (bmi < 30)   return { label: "Overweight",  color: "text-amber-500",   bg: "bg-amber-50 dark:bg-amber-500/10"      }
  return              { label: "Obese",          color: "text-rose-500",    bg: "bg-rose-50 dark:bg-rose-500/10"        }
}

function getDefaultTargets(age: number) {
  const range = ageRanges.find((r) => age <= r.max) ?? ageRanges[ageRanges.length - 1]
  return { intake: range.maintain, burn: range.burn }
}

/* ─── shared atoms (identical to FoodLog / ActivityLog) ── */
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

/* ─── stat row ── */
function StatRow({ icon: Icon, label, value, iconBg, iconColor }: {
  icon: React.ElementType; label: string; value: string
  iconBg: string; iconColor: string
}) {
  return (
    <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon size={14} className={iconColor} />
      </div>
      <span className="text-xs text-slate-500 dark:text-slate-400 flex-1">{label}</span>
      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{value}</span>
    </div>
  )
}

/* ─────────────────────────────────────────────────────
   PROFILE PAGE
───────────────────────────────────────────────────── */
const Profile = () => {
  const { user, setUser, allFoodLogs, allActivityLogs } = useAppContext()
  const navigate = useNavigate()

  const [editing, setEditing]     = useState(false)
  const [saving, setSaving]       = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const [form, setForm] = useState<{
    age: string
    weight: string
    height: string
    goal: "lose" | "maintain" | "gain"
    dailyCalorieIntake: string
    dailyCalorieBurn: string
  }>({
    age:                user?.age?.toString()               ?? "",
    weight:             user?.weight?.toString()            ?? "",
    height:             user?.height?.toString()            ?? "",
    goal:              (user?.goal as "lose" | "maintain" | "gain") ?? "maintain",
    dailyCalorieIntake: user?.dailyCalorieIntake?.toString() ?? "",
    dailyCalorieBurn:   user?.dailyCalorieBurn?.toString()   ?? "",
  })

  /* ── derived stats ── */
  const totalFoodEntries     = allFoodLogs.length
  const totalActivityEntries = allActivityLogs.length
  const totalCalConsumed     = allFoodLogs.reduce((s, f) => s + f.calories, 0)
  const totalCalBurned       = allActivityLogs.reduce((s, a) => s + a.calories, 0)
  const totalActiveMin       = allActivityLogs.reduce((s, a) => s + a.duration, 0)

  const bmiVal = user?.weight && user?.height ? calcBMI(user.weight, user.height) : null
  const bmiCat = bmiVal ? getBMICategory(bmiVal) : null

  const targets = (() => {
    if (user?.dailyCalorieIntake && user?.dailyCalorieBurn)
      return { intake: user.dailyCalorieIntake, burn: user.dailyCalorieBurn }
    return getDefaultTargets(user?.age ?? 30)
  })()

  const goalLabel   = goalLabels[(user?.goal as keyof typeof goalLabels) ?? "maintain"]
  const displayName = user?.username ?? "User"

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { day: "2-digit", month: "2-digit", year: "numeric" })
    : "—"

  const formatActiveTime = (min: number) =>
    min >= 60 ? `${Math.floor(min / 60)}h ${min % 60}m` : `${min}m`

  /* ── save profile ── */
  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        age:               form.age      ? Number(form.age)      : undefined,
        weight:            form.weight   ? Number(form.weight)   : undefined,
        height:            form.height   ? Number(form.height)   : undefined,
        goal:              form.goal     || undefined,
        dailyCalorieIntake:form.dailyCalorieIntake ? Number(form.dailyCalorieIntake) : undefined,
        dailyCalorieBurn:  form.dailyCalorieBurn   ? Number(form.dailyCalorieBurn)   : undefined,
      }
      const { data } = await mockApi.user.update(user!.documentId ?? "", payload)
      setUser(data)
      setEditing(false)
      toast.success("Profile updated")
    } catch {
      toast.error("Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setForm({
      age:                user?.age?.toString()               ?? "",
      weight:             user?.weight?.toString()            ?? "",
      height:             user?.height?.toString()            ?? "",
      goal:              (user?.goal as "lose" | "maintain" | "gain") ?? "maintain",
      dailyCalorieIntake: user?.dailyCalorieIntake?.toString() ?? "",
      dailyCalorieBurn:   user?.dailyCalorieBurn?.toString()   ?? "",
    })
    setEditing(false)
  }

  /* ── logout ── */
  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await mockApi.auth.login({ identifier: "" }) // replaced logout with login as logout doesn't exist
      setUser(null)
      navigate("/login")
      toast.success("Logged out")
    } catch {
      toast.error("Logout failed")
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="page-container">

      {/* ══════ HEADER ══════ */}
      <div className="page-header">
        <div className="flex items-start justify-between max-w-5xl mx-auto">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
              Account
            </p>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Profile</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Manage your settings</p>
          </div>

          {/* Avatar in header */}
          <div className="w-11 h-11 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/30 shrink-0">
            <span className="text-white font-bold text-base leading-none">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* ══════ CONTENT
          Mobile : single column
          Desktop: LEFT = profile info + edit | RIGHT = stats + logout
      ══════ */}
      <div className="px-4 py-5 max-w-5xl mx-auto lg:px-6 lg:pt-6 lg:pb-10">
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-5 lg:items-start">

          {/* ══ LEFT COLUMN ══ */}
          <div className="flex flex-col gap-4">

            {/* Profile identity card */}
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                  <span className="text-white font-bold text-lg leading-none">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                    {displayName}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    Member since {memberSince}
                  </p>
                </div>
                {bmiCat && bmiVal && (
                  <div className={`ml-auto shrink-0 px-2.5 py-1 rounded-xl ${bmiCat.bg}`}>
                    <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">BMI</p>
                    <p className={`text-sm font-bold leading-none ${bmiCat.color}`}>{bmiVal}</p>
                  </div>
                )}
              </div>

              {/* Body stats — view mode */}
              {!editing ? (
                <>
                  <Label icon={User} text="Body Info" iconClass="text-emerald-500" />
                  <div className="space-y-0.5">
                    <StatRow icon={Calendar} label="Age"    value={user?.age    ? `${user.age} yrs`  : "—"} iconBg="bg-violet-50 dark:bg-violet-500/10"  iconColor="text-violet-500"  />
                    <StatRow icon={Scale}    label="Weight" value={user?.weight ? `${user.weight} kg`: "—"} iconBg="bg-amber-50 dark:bg-amber-500/10"    iconColor="text-amber-500"   />
                    <StatRow icon={Ruler}    label="Height" value={user?.height ? `${user.height} cm`: "—"} iconBg="bg-sky-50 dark:bg-sky-500/10"        iconColor="text-sky-500"     />
                    <StatRow icon={Target}   label="Goal"   value={goalLabel}                               iconBg="bg-emerald-50 dark:bg-emerald-500/10" iconColor="text-emerald-500" />
                    <StatRow icon={Utensils} label="Intake Target" value={`${targets.intake} kcal`}         iconBg="bg-teal-50 dark:bg-teal-500/10"      iconColor="text-teal-500"    />
                    <StatRow icon={Flame}    label="Burn Target"   value={`${targets.burn} kcal`}           iconBg="bg-rose-50 dark:bg-rose-500/10"      iconColor="text-rose-500"    />
                  </div>

                  <button
                    onClick={() => setEditing(true)}
                    className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold transition-all active:scale-95"
                  >
                    <Edit3 size={14} /> Edit Profile
                  </button>
                </>
              ) : (
                /* Edit mode */
                <>
                  <Label icon={Edit3} text="Edit Profile" iconClass="text-emerald-500" />
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Age</label>
                        <input type="number" placeholder="e.g. 25" value={form.age} min={1} max={120}
                          onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))}
                          className="login-input" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Weight (kg)</label>
                        <input type="number" placeholder="e.g. 70" value={form.weight} min={1}
                          onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))}
                          className="login-input" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Height (cm)</label>
                        <input type="number" placeholder="e.g. 175" value={form.height} min={1}
                          onChange={(e) => setForm((p) => ({ ...p, height: e.target.value }))}
                          className="login-input" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Goal</label>
                        <div className="relative">
                          <select value={form.goal}
                            onChange={(e) => setForm((p) => ({ ...p, goal: e.target.value as "lose" | "maintain" | "gain" }))}
                            className="login-input appearance-none pr-8">
                            <option value="lose">Lose Weight</option>
                            <option value="maintain">Maintain Weight</option>
                            <option value="gain">Gain Muscle</option>
                          </select>
                          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Daily Intake (kcal)</label>
                        <input type="number" placeholder="e.g. 2000" value={form.dailyCalorieIntake} min={1}
                          onChange={(e) => setForm((p) => ({ ...p, dailyCalorieIntake: e.target.value }))}
                          className="login-input" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Daily Burn (kcal)</label>
                        <input type="number" placeholder="e.g. 500" value={form.dailyCalorieBurn} min={1}
                          onChange={(e) => setForm((p) => ({ ...p, dailyCalorieBurn: e.target.value }))}
                          className="login-input" />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold transition-all active:scale-95"
                      >
                        <X size={14} /> Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-sm font-semibold transition-all disabled:opacity-60 shadow-sm shadow-emerald-500/25"
                      >
                        {saving
                          ? <><Loader2 size={14} className="animate-spin" /> Saving...</>
                          : <><Save size={14} /> Save Changes</>
                        }
                      </button>
                    </div>
                  </div>
                </>
              )}
            </Card>

          </div>

          {/* ══ RIGHT COLUMN ══ */}
          <div className="flex flex-col gap-4">

            {/* Your Stats */}
            <Card className="p-4">
              <Label icon={TrendingUp} text="Your Stats" iconClass="text-emerald-500" />

              <div className="grid grid-cols-2 gap-2.5 mb-4">
                {[
                  { label: "Food Entries",  value: totalFoodEntries.toString(),           icon: Utensils, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                  { label: "Activities",    value: totalActivityEntries.toString(),        icon: Activity, color: "text-violet-500",  bg: "bg-violet-50 dark:bg-violet-500/10"   },
                  { label: "Total Consumed",value: `${totalCalConsumed.toLocaleString()}`, icon: Utensils, color: "text-sky-500",    bg: "bg-sky-50 dark:bg-sky-500/10",
                    unit: "kcal" },
                  { label: "Total Burned",  value: `${totalCalBurned.toLocaleString()}`,   icon: Flame,    color: "text-rose-500",   bg: "bg-rose-50 dark:bg-rose-500/10",
                    unit: "kcal" },
                ].map(({ label, value, icon: Icon, color, bg, unit }) => (
                  <div key={label} className={`${bg} rounded-xl p-3.5 flex items-center gap-3`}>
                    <div className="w-8 h-8 rounded-lg bg-white/60 dark:bg-slate-900/50 flex items-center justify-center shrink-0">
                      <Icon size={14} className={color} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{label}</p>
                      <p className={`text-sm font-bold ${color} leading-tight`}>
                        {value}
                        {unit && <span className="text-[10px] font-normal text-slate-400 ml-0.5">{unit}</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Active time strip */}
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-slate-400" />
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Active Time</span>
                </div>
                <span className="text-sm font-bold text-emerald-500">
                  {formatActiveTime(totalActiveMin)}
                </span>
              </div>
            </Card>

            {/* BMI card — only if data available */}
            {bmiVal && bmiCat && (
              <Card className="p-4">
                <Label icon={ShieldCheck} text="Health Status" iconClass="text-emerald-500" />
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 ${bmiCat.bg}`}>
                    <span className={`text-xl font-bold leading-none ${bmiCat.color}`}>{bmiVal}</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">BMI</span>
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${bmiCat.color}`}>{bmiCat.label}</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">
                      Healthy range is <span className="font-semibold text-slate-500 dark:text-slate-400">18.5 – 24.9</span>
                    </p>
                    {/* gradient scale */}
                    <div className="mt-2.5 relative">
                      <div className="h-2 rounded-full overflow-hidden flex">
                        <div className="flex-1 bg-sky-300" />
                        <div className="flex-1 bg-emerald-400" />
                        <div className="flex-1 bg-amber-400" />
                        <div className="flex-1 bg-rose-400" />
                      </div>
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-700 dark:border-white shadow-sm transition-all duration-700"
                        style={{ left: `calc(${Math.min(((bmiVal - 10) / 30) * 100, 100)}% - 7px)` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      {["Under", "Normal", "Over", "Obese"].map((l) => (
                        <span key={l} className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">{l}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Logout */}
            <Card className="p-4">
              <Label icon={LogOut} text="Session" iconClass="text-slate-400" />
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 -mt-2">
                You're signed in as <span className="font-semibold text-slate-600 dark:text-slate-300">{displayName}</span>
              </p>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 active:scale-95 text-rose-600 dark:text-rose-400 text-sm font-semibold transition-all disabled:opacity-60"
              >
                {loggingOut
                  ? <><Loader2 size={14} className="animate-spin" /> Logging out...</>
                  : <><LogOut size={14} /> Logout</>
                }
              </button>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile