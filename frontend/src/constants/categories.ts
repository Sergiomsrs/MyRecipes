import type { RecipeCategory } from "../types/recipe";

export const categories: RecipeCategory[] = [
    "STARTER",
    "MAIN_COURSE",
    "DESSERT",
    "DRINK",
    "SAUCE",
    "OTHER",
];

export const categoryMeta: Record<
    RecipeCategory,
    { label: string; color: string; emoji: string }
> = {
    STARTER: { label: "Entrante", color: "#7e8c53", emoji: "🥗" },
    MAIN_COURSE: { label: "Plato principal", color: "#c4643f", emoji: "🍲" },
    DESSERT: { label: "Postre", color: "#c9878b", emoji: "🍰" },
    DRINK: { label: "Bebida", color: "#d29b3c", emoji: "🍹" },
    SAUCE: { label: "Salsa", color: "#b0573a", emoji: "🌶️" },
    OTHER: { label: "Otros", color: "#8a7f72", emoji: "📖" },
};