
import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"

const Layout = () => {
  return (
    <div className="layout-container">
      <Sidebar />
      <div id="app-scroll-container" className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  )
}
export default Layout
