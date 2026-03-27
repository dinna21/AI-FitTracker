import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './pages/Layout'
import Profile from './pages/Profile'
import FoodLog from './pages/FoodLog'
import ActivityLog from './pages/ActivityLog'
import Dashboard from './pages/Dashboard'
import { useAppContext } from './context/AppContext'
import Login from './pages/Login'
import Loading from './components/Loading'
import Onboarding from './pages/Onboarding'
import HomePage from './pages/HomePage'

const App = () => {
  const { user, isUserFetched, onboardingCompleted } = useAppContext()

  if (!isUserFetched) {
    return <Loading />
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route
        path="/login"
        element={
          user ? (
            <Navigate to={onboardingCompleted ? '/dashboard' : '/onboarding'} replace />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/onboarding"
        element={
          !user ? (
            <Navigate to="/login" replace />
          ) : onboardingCompleted ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Onboarding />
          )
        }
      />

      <Route
        element={
          user && onboardingCompleted ? (
            <Layout />
          ) : (
            <Navigate to={!user ? '/login' : '/onboarding'} replace />
          )
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/food" element={<FoodLog />} />
        <Route path="/activity" element={<ActivityLog />} />
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to={user ? (onboardingCompleted ? '/dashboard' : '/onboarding') : '/'}
            replace
          />
        }
      />
    </Routes>
  )
}

export default App
