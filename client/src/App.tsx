import { Route, Routes } from 'react-router-dom'
import Layout from './pages/Layout'
import Profile from './pages/Profile'
import FoodLog from './pages/FoodLog'
import ActivityLog from './pages/ActivityLog'
import Dashboard from './pages/Dashboard'
import { useAppContext } from './context/AppContext'
import Login from './pages/Login'

const App = () => {
  const {user , isUserFetched, onboardingCompleted} = useAppContext();
  if(!user){
    return isUserFetched ? <Login /> : <p>Loading</p>
  }
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
