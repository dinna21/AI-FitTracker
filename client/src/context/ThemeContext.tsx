import {createContext} from 'react'

interface ThemContextType {
  theme: string;
  toggleTheme: () => void;
}



const Dashboard = () => {
  return (
    <div>
      
    </div>
  )
}

const ThemeContext = createContext<ThemContextType | undefined>(undefined);

export {ThemeContext, Dashboard}

