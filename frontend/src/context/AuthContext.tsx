/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useState, type ReactNode } from "react";
import { loginUser, type AuthResponse } from "../api/auth";

interface User {
    token: string;
    role: string;
    userId: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

function getStoredUser(): User | null {
    try {
        const stored = sessionStorage.getItem("user");
        if (stored) {
            return JSON.parse(stored);
        }
    } catch {
        // sessionStorage no disponible o dato corrupto
    }
    return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(getStoredUser);

    const login = useCallback(async (email: string, password: string) => {
        const data: AuthResponse = await loginUser(email, password);
        const newUser: User = {
            token: data.token,
            role: data.role,
            userId: data.userId,
            email: email,
        };
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
    }, []);

    const logout = useCallback(() => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading: false,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
