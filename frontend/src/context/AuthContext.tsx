/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { loginUser, type AuthResponse } from "../api/auth";
import { setUnauthorizedHandler } from "../api/axios";
import { recipeQueries } from "../api/queries";
import type { UserRole } from "../types/user";

interface User {
    token: string;
    role: UserRole;
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
    const queryClient = useQueryClient();

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
        void queryClient.prefetchQuery(recipeQueries.list());
        void queryClient.prefetchQuery(recipeQueries.currentVersions());
    }, [queryClient]);

    const logout = useCallback(() => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        queryClient.clear();
        setUser(null);
    }, [queryClient]);

    useEffect(() => {
        setUnauthorizedHandler(logout);
        return () => setUnauthorizedHandler(null);
    }, [logout]);

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
