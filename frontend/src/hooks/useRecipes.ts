import { useCallback, useEffect, useState } from "react";
import * as api from "../api/recipes";
import type {
    Recipe,
    RecipeFormData,
    RecipeVersion,
} from "../types/recipe";

export function useRecipes() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    const getVersions = useCallback(
        (recipeId: string): Promise<RecipeVersion[]> => {
            return api.getVersions(recipeId);
        },
        []
    );

    const createVersion = async (
        recipeId: string,
        summaryChanges: string,
        data: RecipeFormData
    ): Promise<RecipeVersion> => {
        const version = await api.createVersion(recipeId, {
            summaryChanges,
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
        return version;
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
        getVersions,
        createVersion,
    };
}
