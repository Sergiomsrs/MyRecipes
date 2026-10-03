import type { RecipeStatus } from "../types/recipe";

export const recipeStatuses: RecipeStatus[] = ["EVOLUCION", "DEFINITIVA"];

export const statusMeta: Record<
    RecipeStatus,
    { label: string; emoji: string; hint: string }
> = {
    EVOLUCION: {
        label: "En evolución",
        emoji: "🔄",
        hint: "Todavía estás iterando. Al añadir una versión vuelve aquí sola.",
    },
    DEFINITIVA: {
        label: "Versión definitiva",
        emoji: "✅",
        hint: "La has cerrado por ahora. Añadir una versión la reabre.",
    },
};