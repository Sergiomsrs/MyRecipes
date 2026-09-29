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
    { label: string; emoji: string }
> = {
    STARTER: { label: "Entrante", emoji: "🥗" },
    MAIN_COURSE: { label: "Plato principal", emoji: "🍲" },
    DESSERT: { label: "Postre", emoji: "🍰" },
    DRINK: { label: "Bebida", emoji: "🍹" },
    SAUCE: { label: "Salsa", emoji: "🌶️" },
    OTHER: { label: "Otros", emoji: "📖" },
};
