import { Route, Routes } from 'react-router-dom'
import Layout from './pages/Layout'
import Profile from './pages/Profile'
import FoodLog from './pages/FoodLog'
import ActivityLog from './pages/ActivityLog'
import Dashboard from './pages/Dashboard'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="food" element={<FoodLog />} />
          <Route path="activity" element={<ActivityLog />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
