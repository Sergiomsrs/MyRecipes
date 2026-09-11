import { useCallback, useEffect, useState } from "react";
import * as api from "../api/recipes";
import { USER_ID } from "../config";
import type {
    Attempt,
    Recipe,
    RecipeFormData,
    RecipeVersion,
} from "../types/recipe";

const ATTEMPTS_KEY = "recipe_attempts";

function loadAttempts(): Record<string, Attempt[]> {
    try {
        const stored = localStorage.getItem(ATTEMPTS_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
}

function saveAttempts(attempts: Record<string, Attempt[]>) {
    try {
        localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
    } catch {
        // localStorage no disponible
    }
}

export function useRecipes() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [attempts, setAttempts] =
        useState<Record<string, Attempt[]>>(loadAttempts);

    const loadRecipes = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.getRecipes();
            setRecipes(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar las recetas");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRecipes();
    }, [loadRecipes]);

    const createRecipe = async (data: RecipeFormData): Promise<Recipe> => {
        const created = await api.createRecipe({
            userId: USER_ID,
            title: data.title,
            description: data.description,
            category: data.category,
            notes: data.notes,
            rating: data.rating,
            ingredients: data.ingredients
                .filter((ing) => ing.name.trim() && ing.quantity.trim())
                .map((ing, index) => ({
                    name: ing.name.trim(),
                    quantity: parseFloat(ing.quantity),
                    unit: ing.unit.trim(),
                    orderIndex: index + 1,
                })),
            steps: data.steps
                .filter((step) => step.description.trim())
                .sort((a, b) => a.order - b.order)
                .map((step) => ({
                    order: step.order,
                    description: step.description.trim(),
                })),
        });
        setRecipes((current) => [...current, created]);
        return created;
    };

    const updateRecipe = async (id: string, data: RecipeFormData): Promise<Recipe> => {
        const updated = await api.updateRecipe(id, {
            userId: USER_ID,
            title: data.title,
            description: data.description,
            category: data.category,
        });
        setRecipes((current) =>
            current.map((recipe) => (recipe.id === id ? updated : recipe))
        );
        return updated;
    };

    const deleteRecipe = async (id: string): Promise<void> => {
        await api.deleteRecipe(id);
        setRecipes((current) => current.filter((recipe) => recipe.id !== id));
        setAttempts((current) => {
            const next = { ...current };
            delete next[id];
            saveAttempts(next);
            return next;
        });
    };

    const getRecipe = (id: string) => {
        return recipes.find((recipe) => recipe.id === id);
    };

    const getCurrentVersion = useCallback(
        (recipeId: string): Promise<RecipeVersion> => {
            return api.getCurrentVersion(recipeId);
        },
        []
    );

    const addAttempt = (recipeId: string, rating?: number, notes?: string) => {
        const newAttempt: Attempt = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            rating,
            notes,
        };
        setAttempts((current) => {
            const next = {
                ...current,
                [recipeId]: [...(current[recipeId] || []), newAttempt],
            };
            saveAttempts(next);
            return next;
        });
    };

    return {
        recipes,
        isLoading,
        error,
        createRecipe,
        updateRecipe,
        deleteRecipe,
        getRecipe,
        getCurrentVersion,
        attempts,
        addAttempt,
    };
}