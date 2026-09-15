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
    { label: string; color: string; emoji: string; bgClass: string }
> = {
    STARTER: {
        label: "Entrante",
        color: "#4c6544",
        emoji: "🥗",
        bgClass: "bg-secondary-container text-on-secondary-container",
    },
    MAIN_COURSE: {
        label: "Plato principal",
        color: "#9f3c16",
        emoji: "🍲",
        bgClass: "bg-primary-fixed text-on-primary-fixed-variant",
    },
    DESSERT: {
        label: "Postre",
        color: "#984300",
        emoji: "🍰",
        bgClass: "bg-tertiary-fixed text-on-tertiary-fixed",
    },
    DRINK: {
        label: "Bebida",
        color: "#d29b3c",
        emoji: "🍹",
        bgClass: "bg-surface-container-high text-on-surface",
    },
    SAUCE: {
        label: "Salsa",
        color: "#bf542c",
        emoji: "🌶️",
        bgClass: "bg-primary-container/20 text-primary-container",
    },
    OTHER: {
        label: "Otros",
        color: "#57423b",
        emoji: "📖",
        bgClass: "bg-surface-container-high text-on-surface-variant",
    },
};
