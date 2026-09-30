import { queryOptions } from "@tanstack/react-query";
import {
    getCurrentVersion,
    getRecipes,
    getRecipesWithCurrentVersion,
    getVersions,
} from "./recipes";
import { getProfile } from "./users";

export const recipeKeys = {
    all: ["recipes"] as const,
    list: () => ["recipes", "list"] as const,
    currentVersions: () => ["recipes", "current-versions"] as const,
    versions: (recipeId: string) => ["recipes", "versions", recipeId] as const,
    currentVersion: (recipeId: string) =>
        ["recipes", "versions", recipeId, "current"] as const,
};

export const profileKeys = {
    all: ["profile"] as const,
    detail: () => ["profile", "detail"] as const,
};

export const recipeQueries = {
    list: () =>
        queryOptions({
            queryKey: recipeKeys.list(),
            queryFn: getRecipes,
        }),

    currentVersions: () =>
        queryOptions({
            queryKey: recipeKeys.currentVersions(),
            queryFn: ({ signal }) => getRecipesWithCurrentVersion(signal),
        }),

    currentVersion: (recipeId: string) =>
        queryOptions({
            queryKey: recipeKeys.currentVersion(recipeId),
            queryFn: () => getCurrentVersion(recipeId),
            enabled: recipeId.length > 0,
        }),

    versions: (recipeId: string) =>
        queryOptions({
            queryKey: recipeKeys.versions(recipeId),
            queryFn: () => getVersions(recipeId),
            enabled: recipeId.length > 0,
        }),
};

export const profileQueries = {
    detail: () =>
        queryOptions({
            queryKey: profileKeys.detail(),
            queryFn: getProfile,
        }),
};
