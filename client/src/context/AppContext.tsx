import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type ActivityEntry, type Credentials, type FoodEntry, type User } from "../types";
import mockApi from "../assets/mockApi";

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
        const { data } = await mockApi.auth.register(credentials);
        setUser(data.user);
        if (data?.user.age && data?.user?.weight && data?.user?.goal) {
            setOnboardingCompleted(true);
        }
        localStorage.setItem('token', data.jwt);
    }

    const login = async (credentials: Credentials) => {
        const { data } = await mockApi.auth.login(credentials);
        setUser({ ...data.user, token: data.jwt });
        if (data?.user.age && data?.user?.weight && data?.user?.goal) {
            setOnboardingCompleted(true);
        }
        localStorage.setItem('token', data.jwt);
    }

    const fetchUser = async (token: string) => {
        const { data } = await mockApi.user.me();
        setUser({ ...data, token });
        if (data?.age && data?.weight && data?.goal) {
            setOnboardingCompleted(true);
        }
        setIsUserFetched(true);
    }

    const fetchFoodLogs = async () => {
        const { data } = await mockApi.foodLogs.list();
        setAllFoodLogs(data);
    }

    const fetchActivityLogs = async () => {
        const { data } = await mockApi.activityLogs.list();
        setAllActivityLogs(data);
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