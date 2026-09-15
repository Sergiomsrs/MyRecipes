import api from "./axios";
import type {
    CreateRecipePayload,
    CreateVersionPayload,
    Recipe,
    RecipeVersion,
    UpdateRecipePayload,
} from "../types/recipe";

const RECIPES_BASE = "/api/v1/recipes";

export async function getRecipes(): Promise<Recipe[]> {
    const { data } = await api.get<Recipe[]>(RECIPES_BASE);
    return data;
}

export async function getRecipe(id: string): Promise<Recipe> {
    const { data } = await api.get<Recipe>(`${RECIPES_BASE}/${id}`);
    return data;
}

export async function getCurrentVersion(id: string): Promise<RecipeVersion> {
    const { data } = await api.get<RecipeVersion>(
        `${RECIPES_BASE}/${id}/versions/current`
    );
    return data;
}

export async function createRecipe(payload: CreateRecipePayload): Promise<Recipe> {
    const { data } = await api.post<Recipe>(RECIPES_BASE, payload);
    return data;
}

export async function updateRecipe(
    id: string,
    payload: UpdateRecipePayload
): Promise<Recipe> {
    const { data } = await api.put<Recipe>(`${RECIPES_BASE}/${id}`, payload);
    return data;
}

export async function deleteRecipe(id: string): Promise<void> {
    await api.delete(`${RECIPES_BASE}/${id}`);
}

export async function createVersion(
    recipeId: string,
    payload: CreateVersionPayload
): Promise<RecipeVersion> {
    const { data } = await api.post<RecipeVersion>(
        `${RECIPES_BASE}/${recipeId}/versions`,
        payload
    );
    return data;
}
