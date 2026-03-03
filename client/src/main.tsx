import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
    <ThemeProvider>
        <AppProvider>
            <Toaster 
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    removeDelay: 1000,
                    success: { duration: 3000 },
                    error: { duration: 4000 },
                }}
            />
            <App />
        </AppProvider>
    </ThemeProvider>
    </BrowserRouter>,
)
