import api from "./axios";

export interface AuthResponse {
    token: string;
    role: string;
    userId: string;
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/api/auth/login", {
        email,
        password,
    });
    return data;
}
