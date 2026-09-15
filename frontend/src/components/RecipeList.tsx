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
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="size-14 rounded-2xl bg-surface-container flex items-center justify-center mb-4">
                    <span className="text-2xl">🍳</span>
                </div>
                <p className="font-serif font-semibold text-lg text-on-surface mb-2">
                    Tu cuaderno está vacío
                </p>
                <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs">
                    Crea tu primera receta y empieza a documentar cada versión.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-3">
            {recipes.map((recipe) => {
                const meta = categoryMeta[recipe.category];
                const updatedLabel = new Date(recipe.updatedAt).toLocaleDateString(
                    "es-ES",
                    { day: "numeric", month: "short", year: "numeric" }
                );

                return (
                    <article
                        key={recipe.id}
                        className="relative rounded-xl bg-surface-container-lowest p-4 shadow-sm hover:shadow-md transition-shadow recipe-card"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <button
                                type="button"
                                onClick={() => onView(recipe)}
                                className="flex items-start gap-3 min-w-0 text-left flex-1"
                            >
                                <div
                                    className={`w-12 h-12 rounded-lg shrink-0 flex items-center justify-center text-xl ${meta.bgClass}`}
                                >
                                    {meta.emoji}
                                </div>
                                <div className="flex flex-col min-w-0 flex-1">
                                    <h4 className="font-serif font-semibold text-base text-on-surface truncate">
                                        {recipe.title}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                        <span
                                            className={`inline-flex items-center gap-1 text-xs font-semibold px-1.5 py-0.2 rounded-full ${meta.bgClass}`}
                                        >
                                            {meta.label}
                                        </span>
                                        <span className="text-xs text-on-surface-variant font-mono">
                                            {updatedLabel}
                                        </span>
                                    </div>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setOpenMenuId(openMenuId === recipe.id ? null : recipe.id)
                                }
                                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:scale-95 shrink-0"
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
                                <div className="absolute right-4 top-full mt-1 z-20 card py-1 min-w-40 shadow-lg">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOpenMenuId(null);
                                            onEdit(recipe);
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-high transition-colors"
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
                                        className="w-full text-left px-4 py-2.5 text-sm text-error hover:bg-surface-container-high transition-colors"
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
