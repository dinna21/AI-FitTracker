import { createContext } from 'react';

interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const Dashboard = () => {
  return (
    <div>
      {/* Dashboard content goes here */}
    </div>
  );
};

export { ThemeContext, Dashboard };
