import { API_BASE, USER_ID } from "../config";
import type {
    CreateRecipePayload,
    Recipe,
    UpdateRecipePayload,
} from "../types/recipe";

interface ApiErrorBody {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    path: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });

    if (!response.ok) {
        let message = `Error ${response.status}`;
        try {
            const body = (await response.json()) as ApiErrorBody;
            message = body.message || message;
        } catch {
            // respuesta sin cuerpo JSON
        }
        throw new Error(message);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return (await response.json()) as T;
}

export function getRecipes(): Promise<Recipe[]> {
    return request<Recipe[]>(`?userId=${USER_ID}`);
}

export function getRecipe(id: string): Promise<Recipe> {
    return request<Recipe>(`/${id}?userId=${USER_ID}`);
}

export function createRecipe(payload: CreateRecipePayload): Promise<Recipe> {
    return request<Recipe>("", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function updateRecipe(
    id: string,
    payload: UpdateRecipePayload
): Promise<Recipe> {
    return request<Recipe>(`/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export function deleteRecipe(id: string): Promise<void> {
    return request<void>(`/${id}?userId=${USER_ID}`, { method: "DELETE" });
}