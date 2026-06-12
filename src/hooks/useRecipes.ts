import { useState, useEffect } from "react";
import type { Recipe, RecipeFormData } from "../types/recipe";

const STORAGE_KEY = "recipes_app";

export function useRecipes() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Cargar recetas del localStorage
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setRecipes(JSON.parse(stored));
            } catch {
                console.error("Error al cargar recetas");
            }
        }
        setIsLoading(false);
    }, []);

    // Guardar recetas en localStorage
    const saveRecipes = (updatedRecipes: Recipe[]) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecipes));
        setRecipes(updatedRecipes);
    };

    const createRecipe = (data: RecipeFormData) => {
        const newRecipe: Recipe = {
            id: Date.now().toString(),
            name: data.name,
            description: data.description,
            ingredients: data.ingredients,
            steps: data.steps,
            attempts: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const updatedRecipes = [...recipes, newRecipe];
        saveRecipes(updatedRecipes);
        return newRecipe;
    };

    const updateRecipe = (id: string, data: RecipeFormData) => {
        const updatedRecipes = recipes.map((recipe) =>
            recipe.id === id
                ? {
                    ...recipe,
                    name: data.name,
                    description: data.description,
                    ingredients: data.ingredients,
                    steps: data.steps,
                    updatedAt: new Date().toISOString(),
                }
                : recipe
        );

        saveRecipes(updatedRecipes);
    };

    const deleteRecipe = (id: string) => {
        const updatedRecipes = recipes.filter((recipe) => recipe.id !== id);
        saveRecipes(updatedRecipes);
    };

    const getRecipe = (id: string) => {
        return recipes.find((recipe) => recipe.id === id);
    };

    const addAttempt = (recipeId: string, rating?: number, notes?: string) => {
        const updatedRecipes = recipes.map((recipe) =>
            recipe.id === recipeId
                ? {
                    ...recipe,
                    attempts: [
                        ...recipe.attempts,
                        {
                            id: Date.now().toString(),
                            date: new Date().toISOString(),
                            rating,
                            notes,
                        },
                    ],
                }
                : recipe
        );

        saveRecipes(updatedRecipes);
    };

    return {
        recipes,
        isLoading,
        createRecipe,
        updateRecipe,
        deleteRecipe,
        getRecipe,
        addAttempt,
    };
}
