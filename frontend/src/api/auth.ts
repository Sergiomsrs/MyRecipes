import api from "./axios";
import type { UserRole } from "../types/user";

export interface AuthResponse {
    token: string;
    role: UserRole;
    userId: string;
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>(
        "/api/auth/login",
        { email, password },
        { skipAuthRedirect: true }
    );
    return data;
}