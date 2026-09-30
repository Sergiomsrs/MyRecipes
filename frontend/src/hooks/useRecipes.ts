import { useQuery } from "@tanstack/react-query";
import { profileQueries, recipeQueries } from "../api/queries";

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

export function useProfile() {
    return useQuery(profileQueries.detail());
}
