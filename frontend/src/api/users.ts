import api from "./axios";
import type { UserRole } from "../types/user";

export interface UserProfile {
    userId: string;
    email: string;
    role: UserRole;
}

export async function getProfile(): Promise<UserProfile> {
    const { data } = await api.get<UserProfile>("/api/users/me");
    return data;
}

export async function changePassword(
    currentPassword: string,
    newPassword: string
): Promise<{ message: string }> {
    const { data } = await api.put<{ message: string }>("/api/users/me/password", {
        currentPassword,
        newPassword,
    });
    return data;
}