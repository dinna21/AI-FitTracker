import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type ActivityEntry, type Credentials, type FoodEntry, type User } from "../types";
import api from "../assets/api";

interface AppContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isUserFetched: boolean;
  setIsUserFetched: React.Dispatch<React.SetStateAction<boolean>>;
  onboardingCompleted: boolean;
  setOnboardingCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  allFoodLogs: FoodEntry[];
  setAllFoodLogs: React.Dispatch<React.SetStateAction<FoodEntry[]>>;
  allActivityLogs: ActivityEntry[];
  setAllActivityLogs: React.Dispatch<React.SetStateAction<ActivityEntry[]>>;
  logout: () => void;
  login: (credentials: Credentials) => Promise<void>;
  signup: (credentials: Credentials) => Promise<void>;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [isUserFetched, setIsUserFetched] = useState(false);
    const [onboardingCompleted, setOnboardingCompleted] = useState(false);
    const [allFoodLogs, setAllFoodLogs] = useState<FoodEntry[]>([]);
    const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([]);

    const signup = async (credentials: Credentials) => {
        const { data } = await api.auth.register(credentials);
        localStorage.setItem('token', data.jwt);
        // Fetch full profile (custom fields like onboardingCompleted, age, goal)
        const { data: fullUser } = await api.user.me();
        setUser({ ...fullUser, token: data.jwt } as any);
        if (fullUser?.onboardingCompleted || (fullUser?.age && fullUser?.weight && fullUser?.goal)) {
            setOnboardingCompleted(true);
        }
        await fetchFoodLogs();
        await fetchActivityLogs();
    }

    const login = async (credentials: Credentials) => {
        const { data } = await api.auth.login(credentials);
        localStorage.setItem('token', data.jwt);
        // Fetch full profile (custom fields like onboardingCompleted, age, goal)
        const { data: fullUser } = await api.user.me();
        setUser({ ...fullUser, token: data.jwt } as any);
        if (fullUser?.onboardingCompleted || (fullUser?.age && fullUser?.weight && fullUser?.goal)) {
            setOnboardingCompleted(true);
        }
        await fetchFoodLogs();
        await fetchActivityLogs();
    }

    const fetchUser = async (token: string) => {
        try {
            const { data } = await api.user.me();
            setUser({ ...data, token } as any);
            if (data?.onboardingCompleted || (data?.age && data?.weight && data?.goal)) {
                setOnboardingCompleted(true);
            }
        } catch {
            // Invalid/expired token — clear it so user sees login screen
            localStorage.removeItem('token');
        } finally {
            setIsUserFetched(true);
        }
    }

    const fetchFoodLogs = async () => {
        try {
            const { data } = await api.foodLogs.list();
            setAllFoodLogs(data as any);
        } catch { /* non-fatal — dashboard falls back to empty state */ }
    }

    const fetchActivityLogs = async () => {
        try {
            const { data } = await api.activityLogs.list();
            setAllActivityLogs(data as any);
        } catch { /* non-fatal */ }
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        setOnboardingCompleted(false);
        navigate('/');
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            (async () => {
                await fetchUser(token);
                await fetchFoodLogs();
                await fetchActivityLogs();
            })();
        } else {
            setIsUserFetched(true);
        }
    }, []);

    return (
        <AppContext.Provider value={{
            user, setUser,
            isUserFetched, setIsUserFetched,
            onboardingCompleted, setOnboardingCompleted,
            allFoodLogs, setAllFoodLogs,
            allActivityLogs, setAllActivityLogs,
            logout, login, signup
        }}>
            {children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}