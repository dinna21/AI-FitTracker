import { ActivityIcon, HomeIcon, UserIcon, UtensilsIcon, Sun, Moon, Activity } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"

const navItems = [
  { label: "Home",     path: "/",         icon: HomeIcon },
  { label: "Food",     path: "/food",      icon: UtensilsIcon },
  { label: "Activity", path: "/activity",  icon: ActivityIcon },
  { label: "Profile",  path: "/profile",   icon: UserIcon },
]

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  return (
    <>
      {/* ─────────────────────────────────────────
          DESKTOP SIDEBAR  (lg and above)
      ───────────────────────────────────────── */}
      <aside className="
        hidden lg:flex flex-col
        w-60 shrink-0 sticky top-0 min-h-screen
        bg-white dark:bg-slate-900
        border-r border-slate-100 dark:border-slate-800
        transition-colors duration-200
      ">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/30">
            <Activity size={16} className="text-white" />
          </div>
          <span className="text-base font-bold text-slate-800 dark:text-white tracking-tight">
            FitTrack
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-5 flex flex-col gap-1 overflow-y-auto">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-3 mb-2">
            Navigation
          </p>

          {navItems.map(({ label, path, icon: Icon }) => {
            const isActive = location.pathname === path
            return (
              <NavLink
                key={path}
                to={path}
                className={`
                  relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                  text-sm font-medium transition-all duration-200 group
                  ${isActive
                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/70 hover:text-slate-800 dark:hover:text-white"
                  }
                `}
              >
                {/* Active left accent bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-emerald-500" />
                )}

                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200
                  ${isActive
                    ? "bg-emerald-500 shadow-md shadow-emerald-500/25"
                    : "bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                  }
                `}>
                  <Icon size={15} className={isActive ? "text-white" : "text-slate-500 dark:text-slate-400"} />
                </div>

                <span className="flex-1">{label}</span>

                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Dark / Light Toggle — pinned to bottom */}
        <div className="px-3 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            className="
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
              text-sm font-medium transition-all duration-200 group
              text-slate-500 dark:text-slate-400
              hover:bg-slate-50 dark:hover:bg-slate-800/70
              hover:text-slate-800 dark:hover:text-white
            "
          >
            <div className="
              w-8 h-8 rounded-lg flex items-center justify-center shrink-0
              bg-slate-100 dark:bg-slate-800
              group-hover:bg-slate-200 dark:group-hover:bg-slate-700
              transition-all duration-200
            ">
              {theme === "dark"
                ? <Sun size={15} className="text-amber-400" />
                : <Moon size={15} className="text-slate-500" />
              }
            </div>

            <span className="flex-1 text-left">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>

            {/* Toggle pill */}
            <div className={`
              relative w-9 h-5 rounded-full shrink-0 transition-colors duration-300
              ${theme === "dark" ? "bg-emerald-500" : "bg-slate-200"}
            `}>
              <span className={`
                absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm
                transition-all duration-300
                ${theme === "dark" ? "left-[18px]" : "left-0.5"}
              `} />
            </div>
          </button>
        </div>
      </aside>

      {/* ─────────────────────────────────────────
          MOBILE BOTTOM NAV  (below lg)
      ───────────────────────────────────────── */}
      <nav
        className="
          lg:hidden
          fixed bottom-0 left-0 right-0 z-50
          bg-white/80 dark:bg-slate-900/80
          backdrop-blur-xl
          border-t border-slate-200/70 dark:border-slate-800/70
          transition-colors duration-200
        "
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-around px-1 py-1.5">

          {navItems.map(({ label, path, icon: Icon }) => {
            const isActive = location.pathname === path
            return (
              <NavLink
                key={path}
                to={path}
                className="flex flex-col items-center gap-0.5 flex-1 py-1 group"
              >
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center
                  transition-all duration-200
                  ${isActive
                    ? "bg-emerald-500 shadow-lg shadow-emerald-500/30 scale-105"
                    : "group-active:bg-slate-100 dark:group-active:bg-slate-800"
                  }
                `}>
                  <Icon
                    size={18}
                    className={`transition-colors duration-200 ${
                      isActive ? "text-white" : "text-slate-400 dark:text-slate-500"
                    }`}
                  />
                </div>
                <span className={`
                  text-[10px] font-semibold tracking-wide transition-colors duration-200
                  ${isActive ? "text-emerald-500" : "text-slate-400 dark:text-slate-500"}
                `}>
                  {label}
                </span>
              </NavLink>
            )
          })}

          {/* Theme toggle as 5th bottom nav item */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex flex-col items-center gap-0.5 flex-1 py-1 group"
          >
            <div className="
              w-10 h-10 rounded-xl flex items-center justify-center
              group-active:bg-slate-100 dark:group-active:bg-slate-800
              transition-all duration-200
            ">
              {theme === "dark"
                ? <Sun size={18} className="text-amber-400" />
                : <Moon size={18} className="text-slate-400 dark:text-slate-500" />
              }
            </div>
            <span className="text-[10px] font-semibold tracking-wide text-slate-400 dark:text-slate-500">
              {theme === "dark" ? "Light" : "Dark"}
            </span>
          </button>

        </div>
      </nav>
    </>
  )
}

export default Sidebar