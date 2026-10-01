import type { Recipe } from "../types/recipe";
import { useState } from "react";
import { categoryMeta } from "../constants/categories";

interface RecipeListProps {
    recipes: Recipe[];
    onView: (recipe: Recipe) => void;
    onEdit: (recipe: Recipe) => void;
    onDelete: (id: string) => void;
}

export default function RecipeList({
    recipes,
    onView,
    onEdit,
    onDelete,
}: RecipeListProps) {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    if (recipes.length === 0) {
        return (
            <div className="py-16 text-center">
                <p className="font-serif text-lg text-on-surface mb-1.5">
                    Tu cuaderno está vacío
                </p>
                <p className="text-on-surface-variant text-sm max-w-xs mx-auto">
                    Crea tu primera receta y empieza a documentar cada versión.
                </p>
            </div>
        );
    }

    return (
        <div className="-mx-2">
            {recipes.map((recipe, index) => {
                const meta = categoryMeta[recipe.category];
                const updatedLabel = new Date(recipe.updatedAt).toLocaleDateString(
                    "es-ES",
                    { day: "numeric", month: "short", year: "numeric" }
                );

                return (
                    <article
                        key={recipe.id}
                        className={`relative transition-colors ${
                            index > 0
                                ? "border-t border-outline-variant/40"
                                : ""
                        }`}
                    >
                        <div className="flex items-center justify-between gap-2 py-4 px-2">
                            <button
                                type="button"
                                onClick={() => onView(recipe)}
                                className="flex items-center gap-3.5 min-w-0 text-left flex-1 py-2 -my-2 rounded-lg transition-colors hover:bg-surface-container-low/70 focus-visible:bg-surface-container-low/70"
                            >
                                <span
                                    className="w-10 h-10 shrink-0 flex items-center justify-center text-lg"
                                    aria-hidden="true"
                                >
                                    {meta.emoji}
                                </span>
                                <span className="flex flex-col min-w-0 flex-1">
                                    <span className="font-serif text-base text-on-surface truncate">
                                        {recipe.title}
                                    </span>
                                    <span className="text-xs text-on-surface-variant truncate">
                                        {meta.label}
                                        <span className="mx-1.5" aria-hidden="true">
                                            ·
                                        </span>
                                        {updatedLabel}
                                    </span>
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setOpenMenuId(openMenuId === recipe.id ? null : recipe.id)
                                }
                                className="w-8 h-8 -mr-1 flex items-center justify-center text-on-surface-variant/70 hover:text-on-surface transition-colors shrink-0"
                                aria-label="Opciones"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                            </button>
                        </div>

                        {openMenuId === recipe.id && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setOpenMenuId(null)}
                                />
                                <div className="absolute right-3 top-full mt-1 z-20 plane py-1 min-w-40">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOpenMenuId(null);
                                            onEdit(recipe);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOpenMenuId(null);
                                            if (
                                                window.confirm(
                                                    `¿Eliminar la receta "${recipe.title}"?`
                                                )
                                            ) {
                                                onDelete(recipe.id);
                                            }
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-error hover:bg-surface-container-low transition-colors"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </>
                        )}
                    </article>
                );
            })}
        </div>
    );
}
