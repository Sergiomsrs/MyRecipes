import type { Recipe } from "../types/recipe";
import { useState } from "react";
import { categoryMeta } from "../constants/categories";
import FavoriteButton from "./FavoriteButton";
import RecipeStatusBadge from "./RecipeStatusBadge";

interface RecipeListProps {
    recipes: Recipe[];
    onView: (recipe: Recipe) => void;
    onPrefetch: (recipeId: string) => void;
    onCancelPrefetch: (recipeId: string) => void;
    onEdit: (recipe: Recipe) => void;
    onDelete: (id: string) => void;
    onToggleFavorite: (recipe: Recipe) => void;
}

export default function RecipeList({
    recipes,
    onView,
    onPrefetch,
    onCancelPrefetch,
    onEdit,
    onDelete,
    onToggleFavorite,
}: RecipeListProps) {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);

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
                        className={`relative transition-colors ${index > 0
                                ? "border-t border-outline-variant/40"
                                : ""
                            }`}
                    >
                        <div className="flex items-center justify-between gap-2 py-4 px-2">
                            <button
                                type="button"
                                onPointerEnter={() => onPrefetch(recipe.id)}
                                onPointerLeave={() => onCancelPrefetch(recipe.id)}
                                onFocus={() => onPrefetch(recipe.id)}
                                onBlur={() => onCancelPrefetch(recipe.id)}
                                onClick={() => {
                                    onCancelPrefetch(recipe.id);
                                    onView(recipe);
                                }}
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
                                    <span className="mt-1">
                                        <RecipeStatusBadge
                                            status={recipe.status}
                                        />
                                    </span>
                                </span>
                            </button>

                            <FavoriteButton
                                favorite={recipe.favorite}
                                onToggle={() => onToggleFavorite(recipe)}
                            />

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
                                            setRecipeToDelete(recipe);
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

            {recipeToDelete && (
                <>
                    <button
                        type="button"
                        className="fixed inset-0 z-40 bg-on-surface/40"
                        aria-label="Cancelar eliminación"
                        onClick={() => setRecipeToDelete(null)}
                    />
                    <div className="fixed inset-0 z-50 flex items-end justify-center p-3 md:items-center md:p-4">
                        <section
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="delete-recipe-dialog-title"
                            className="plane w-full max-w-md rounded-t-2xl p-5 shadow-xl md:rounded-xl"
                        >
                            <div className="mb-5">
                                <h2
                                    id="delete-recipe-dialog-title"
                                    className="font-serif text-xl text-on-surface"
                                >
                                    Eliminar receta
                                </h2>
                                <p className="mt-1 text-sm text-on-surface-variant">
                                    ¿Seguro que quieres eliminar “{recipeToDelete.title}”?
                                    Esta acción no se puede deshacer.
                                </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <button
                                    type="button"
                                    className="btn-outline"
                                    onClick={() => setRecipeToDelete(null)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="btn-primary"
                                    onClick={() => {
                                        onDelete(recipeToDelete.id);
                                        setRecipeToDelete(null);
                                    }}
                                >
                                    Eliminar receta
                                </button>
                            </div>
                        </section>
                    </div>
                </>
            )}
        </div>
    );
}
