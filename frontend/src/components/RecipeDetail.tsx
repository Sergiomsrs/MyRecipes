import type { Attempt, Recipe } from "../types/recipe";
import { categoryLabels } from "../constants/categories";

interface RecipeDetailProps {
    recipe: Recipe;
    attempts: Attempt[];
    onEdit: (recipe: Recipe) => void;
    onBack: () => void;
    onAddAttempt: () => void;
}

export default function RecipeDetail({
    recipe,
    attempts,
    onEdit,
    onBack,
    onAddAttempt,
}: RecipeDetailProps) {
    return (
        <div className="pb-28 md:pb-8">
            <div className="page-container pt-4 flex items-center justify-between">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center gap-1.5 p-2 -ml-2 text-text-muted hover:text-text active:text-text transition-colors"
                    aria-label="Volver"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm font-medium">Recetas</span>
                </button>
                <button
                    type="button"
                    onClick={() => onEdit(recipe)}
                    className="text-sm font-medium text-accent hover:opacity-80 active:opacity-80 transition-opacity"
                >
                    Editar
                </button>
            </div>

            <div className="page-container py-4 md:py-6">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-2">
                    <span className="gradient-text">{recipe.title}</span>
                </h1>
                <p className="font-mono text-xs text-text-muted mb-3">
                    {categoryLabels[recipe.category]}
                </p>
                {recipe.description && (
                    <p className="text-text-muted text-sm md:text-base leading-relaxed max-w-2xl">
                        {recipe.description}
                    </p>
                )}

                <button
                    type="button"
                    onClick={onAddAttempt}
                    className="hidden md:block mt-6 max-w-xs py-3 btn-gradient"
                >
                    Registrar intento
                </button>
            </div>

            <div className="page-container pb-6">
                <div className="py-5">
                    <p className="section-label mb-3">Historial</p>
                    {attempts.length === 0 ? (
                        <p className="text-sm text-text-muted">
                            Aún no has registrado intentos para esta receta.
                        </p>
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {attempts
                                .sort(
                                    (a, b) =>
                                        new Date(b.date).getTime() - new Date(a.date).getTime()
                                )
                                .map((attempt) => (
                                    <div key={attempt.id} className="card-raised p-4">
                                        <div className="flex justify-between items-baseline gap-3 mb-1">
                                            <span className="font-mono text-xs text-accent">
                                                {new Date(attempt.date).toLocaleDateString("es-ES", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                            {attempt.rating && (
                                                <span className="text-accent-orange text-sm">
                                                    {"★".repeat(attempt.rating)}
                                                    <span className="text-border">
                                                        {"★".repeat(5 - attempt.rating)}
                                                    </span>
                                                </span>
                                            )}
                                        </div>
                                        {attempt.notes && (
                                            <p className="text-sm text-text-muted leading-relaxed">
                                                {attempt.notes}
                                            </p>
                                        )}
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="fixed-bar md:hidden">
                <div className="page-container">
                    <button
                        type="button"
                        onClick={onAddAttempt}
                        className="w-full py-3.5 btn-gradient"
                    >
                        Registrar intento
                    </button>
                </div>
            </div>
        </div>
    );
}