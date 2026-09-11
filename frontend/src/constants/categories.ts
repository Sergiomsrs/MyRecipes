import type { RecipeCategory } from "../types/recipe";

export const categories: RecipeCategory[] = [
    "STARTER",
    "MAIN_COURSE",
    "DESSERT",
    "DRINK",
    "SAUCE",
    "OTHER",
];

export const categoryLabels: Record<RecipeCategory, string> = {
    STARTER: "Entrante",
    MAIN_COURSE: "Plato principal",
    DESSERT: "Postre",
    DRINK: "Bebida",
    SAUCE: "Salsa",
    OTHER: "Otros",
};