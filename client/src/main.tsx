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
            <Toaster position="top-center" />
            <App />
        </AppProvider>
    </ThemeProvider>
    </BrowserRouter>,
)
