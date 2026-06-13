import type { Recipe } from "../types/recipe";
import { useState } from "react";

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
                <div className="size-12 rounded-xl bg-surface border border-border flex items-center justify-center mb-4">
                    <span className="text-2xl">🍳</span>
                </div>
                <p className="font-semibold text-text mb-2">
                    Sin recetas todavía
                </p>
                <p className="text-text-muted text-sm leading-relaxed max-w-xs">
                    Crea tu primera receta y empieza a registrar cada intento.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => {
                const lastAttempt = recipe.attempts[recipe.attempts.length - 1];
                const attemptLabel =
                    recipe.attempts.length === 0
                        ? "Sin intentos"
                        : `${recipe.attempts.length} intento${recipe.attempts.length !== 1 ? "s" : ""}${
                              lastAttempt
                                  ? ` · ${new Date(lastAttempt.date).toLocaleDateString("es-ES", { month: "short", year: "numeric" })}`
                                  : ""
                          }`;

                return (
                    <div key={recipe.id} className="relative">
                        <button
                            type="button"
                            onClick={() => onView(recipe)}
                            className="card w-full h-full text-left p-4 hover:border-accent/40 active:border-accent/50 transition-colors"
                        >
                            <h3 className="font-semibold text-text mb-1 pr-8">
                                {recipe.name}
                            </h3>
                            <p className="font-mono text-xs text-text-muted">
                                {attemptLabel}
                            </p>
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setOpenMenuId(openMenuId === recipe.id ? null : recipe.id)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-text-muted hover:text-text active:text-text transition-colors"
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
                                <div className="absolute right-2 top-full mt-1 z-20 card py-1 min-w-36 shadow-xl">
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
                                                    `¿Eliminar la receta "${recipe.name}"?`
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
