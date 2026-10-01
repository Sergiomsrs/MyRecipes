import { useCallback, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { profileQueries, recipeQueries } from "../api/queries";

const RECIPE_PREFETCH_DELAY = 300;

export function useRecipesList() {
    return useQuery(recipeQueries.list());
}

export function useCookbook() {
    return useQuery(recipeQueries.currentVersions());
}

export function useRecipeCurrentVersion(recipeId: string) {
    return useQuery(recipeQueries.currentVersion(recipeId));
}

export function useRecipeVersions(recipeId: string) {
    return useQuery(recipeQueries.versions(recipeId));
}

export function usePrefetchRecipe() {
    const queryClient = useQueryClient();
    const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

    const prefetchRecipe = useCallback(
        (recipeId: string) => {
            if (timers.current.has(recipeId)) return;

            const timer = setTimeout(() => {
                timers.current.delete(recipeId);
                void Promise.all([
                    queryClient.prefetchQuery(recipeQueries.currentVersion(recipeId)),
                    queryClient.prefetchQuery(recipeQueries.versions(recipeId)),
                ]);
            }, RECIPE_PREFETCH_DELAY);

            timers.current.set(recipeId, timer);
        },
        [queryClient]
    );

    const cancelRecipePrefetch = useCallback((recipeId: string) => {
        const timer = timers.current.get(recipeId);
        if (timer === undefined) return;

        clearTimeout(timer);
        timers.current.delete(recipeId);
    }, []);

    useEffect(
        () => () => {
            timers.current.forEach(clearTimeout);
            timers.current.clear();
        },
        []
    );

    return { prefetchRecipe, cancelRecipePrefetch };
}

export function useProfile() {
    return useQuery(profileQueries.detail());
}
