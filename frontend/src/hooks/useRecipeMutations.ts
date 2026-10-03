import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createRecipe,
    createVersion,
    deleteRecipe,
    updateRecipe,
    updateRecipeFavorite,
} from "../api/recipes";
import { recipeKeys } from "../api/queries";
import type {
    CreateIngredientPayload,
    CreateStepPayload,
    Recipe,
    RecipeFormData,
} from "../types/recipe";

function toIngredientPayloads(
    data: RecipeFormData
): CreateIngredientPayload[] {
    return data.ingredients
        .filter((ingredient) => ingredient.name.trim() && ingredient.quantity.trim())
        .map((ingredient, index) => ({
            name: ingredient.name.trim(),
            quantity: parseFloat(ingredient.quantity),
            unit: ingredient.unit.trim(),
            orderIndex: index + 1,
        }));
}

function toStepPayloads(data: RecipeFormData): CreateStepPayload[] {
    return data.steps
        .filter((step) => step.description.trim())
        .sort((a, b) => a.order - b.order)
        .map((step) => ({
            order: step.order,
            description: step.description.trim(),
        }));
}

function invalidateRecipes(queryClient: ReturnType<typeof useQueryClient>) {
    return queryClient.invalidateQueries({ queryKey: recipeKeys.all });
}

export function useCreateRecipe() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: RecipeFormData) =>
            createRecipe({
                title: data.title,
                description: data.description,
                category: data.category,
                status: data.status,
                favorite: data.favorite,
                notes: data.notes,
                rating: data.rating,
                ingredients: toIngredientPayloads(data),
                steps: toStepPayloads(data),
            }),
        onSuccess: () => invalidateRecipes(queryClient),
    });
}

export function useUpdateRecipe() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: RecipeFormData }) =>
            updateRecipe(id, {
                title: data.title,
                description: data.description,
                category: data.category,
                status: data.status,
                favorite: data.favorite,
            }),
        onSuccess: () => invalidateRecipes(queryClient),
    });
}

export function useToggleFavorite() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, favorite }: { id: string; favorite: boolean }) =>
            updateRecipeFavorite(id, favorite),
        onMutate: async ({ id, favorite }) => {
            await queryClient.cancelQueries({ queryKey: recipeKeys.list() });
            const previous = queryClient.getQueryData<Recipe[]>(
                recipeKeys.list()
            );

            queryClient.setQueryData<Recipe[]>(recipeKeys.list(), (recipes) =>
                recipes?.map((recipe) =>
                    recipe.id === id ? { ...recipe, favorite } : recipe
                )
            );

            return { previous };
        },
        onError: (_error, _variables, context) => {
            if (context?.previous) {
                queryClient.setQueryData(recipeKeys.list(), context.previous);
                return;
            }
            void queryClient.invalidateQueries({ queryKey: recipeKeys.all });
        },
        onSettled: () => invalidateRecipes(queryClient),
    });
}

export function useDeleteRecipe() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteRecipe(id),
        onSuccess: () => invalidateRecipes(queryClient),
    });
}

export function useCreateVersion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            recipeId,
            summaryChanges,
            data,
        }: {
            recipeId: string;
            summaryChanges: string;
            data: RecipeFormData;
        }) =>
            createVersion(recipeId, {
                summaryChanges,
                notes: data.notes,
                rating: data.rating,
                ingredients: toIngredientPayloads(data),
                steps: toStepPayloads(data),
            }),
        onSuccess: (_newVersion, { recipeId }) => {
            invalidateRecipes(queryClient);
            return queryClient.invalidateQueries({
                queryKey: recipeKeys.versions(recipeId),
            });
        },
    });
}
