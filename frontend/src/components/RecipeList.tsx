import type { Recipe } from "../types/recipe";
import { useState } from "react";
import { categoryMeta } from "../constants/categories";

interface RecipeListProps {
    recipes: Recipe[];
    attemptsCount?: Record<string, number>;
    onView: (recipe: Recipe) => void;
    onEdit: (recipe: Recipe) => void;
    onDelete: (id: string) => void;
}

export default function RecipeList({
    recipes,
    attemptsCount,
    onView,
    onEdit,
    onDelete,
}: RecipeListProps) {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    if (recipes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="size-14 rounded-2xl bg-surface border border-border flex items-center justify-center mb-4">
                    <span className="text-2xl">🍳</span>
                </div>
                <p className="font-serif font-semibold text-lg text-text mb-2">
                    Tu cuaderno está vacío
                </p>
                <p className="text-text-muted text-sm leading-relaxed max-w-xs">
                    Crea tu primera receta y empieza a registrar cada intento.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => {
                const count = attemptsCount?.[recipe.id] ?? 0;
                const meta = categoryMeta[recipe.category];
                const attemptLabel =
                    count === 0
                        ? "Sin intentos"
                        : `${count} intento${count !== 1 ? "s" : ""}`;
                const updatedLabel = new Date(recipe.updatedAt).toLocaleDateString(
                    "es-ES",
                    { day: "numeric", month: "short", year: "numeric" }
                );

                return (
                    <div key={recipe.id} className="relative">
                        <button
                            type="button"
                            onClick={() => onView(recipe)}
                            className="card w-full h-full text-left p-5 hover:border-accent/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
                        >
                            <span className="chip mb-3">
                                <span
                                    className="category-dot"
                                    style={{ backgroundColor: meta.color }}
                                />
                                <span>{meta.emoji}</span>
                                {meta.label}
                            </span>
                            <h3 className="font-serif font-semibold text-lg text-text mb-2 pr-8 leading-snug">
                                {recipe.title}
                            </h3>
                            <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-text-muted">
                                <span>{attemptLabel}</span>
                                <span aria-hidden="true">·</span>
                                <span>Actualizada {updatedLabel}</span>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setOpenMenuId(openMenuId === recipe.id ? null : recipe.id)
                            }
                            className="absolute right-4 top-5 p-2 text-text-muted hover:text-text active:text-text transition-colors"
                            aria-label="Opciones"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                        </button>

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
                                        className="w-full text-left px-4 py-2.5 text-sm text-text hover:bg-surface-raised active:bg-surface-raised transition-colors"
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
                                        className="w-full text-left px-4 py-2.5 text-sm text-accent-pink hover:bg-surface-raised active:bg-surface-raised transition-colors"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
}