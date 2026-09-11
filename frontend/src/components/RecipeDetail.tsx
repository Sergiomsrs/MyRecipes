import type {
    Attempt,
    Recipe,
    RecipeVersion,
} from "../types/recipe";
import { categoryMeta } from "../constants/categories";

interface RecipeDetailProps {
    recipe: Recipe;
    version: RecipeVersion | null;
    isVersionLoading: boolean;
    attempts: Attempt[];
    onEdit: (recipe: Recipe) => void;
    onBack: () => void;
    onAddAttempt: () => void;
}

export default function RecipeDetail({
    recipe,
    version,
    isVersionLoading,
    attempts,
    onEdit,
    onBack,
    onAddAttempt,
}: RecipeDetailProps) {
    const meta = categoryMeta[recipe.category];
    const createdLabel = new Date(recipe.createdAt).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    const updatedLabel = new Date(recipe.updatedAt).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

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
                    className="text-sm font-medium text-accent-strong hover:opacity-80 active:opacity-80 transition-opacity"
                >
                    Editar
                </button>
            </div>

            <div className="page-container py-5 md:py-8">
                <span className="chip mb-4">
                    <span
                        className="category-dot"
                        style={{ backgroundColor: meta.color }}
                    />
                    <span>{meta.emoji}</span>
                    {meta.label}
                </span>
                <h1 className="font-serif font-semibold text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight mb-5">
                    {recipe.title}
                </h1>
                {recipe.description && (
                    <p className="text-text-muted text-base md:text-lg leading-relaxed max-w-2xl">
                        {recipe.description}
                    </p>
                )}
                <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-text-muted mt-5">
                    <span>
                        {attempts.length} intento{attempts.length !== 1 ? "s" : ""} registrado{attempts.length !== 1 ? "s" : ""}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Creada {createdLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>Actualizada {updatedLabel}</span>
                </div>

                <button
                    type="button"
                    onClick={onAddAttempt}
                    className="hidden md:block mt-8 max-w-xs py-3 btn-primary"
                >
                    Registrar intento
                </button>
            </div>

            <div className="page-container pb-6">
                {isVersionLoading ? (
                    <p className="py-5 text-sm text-text-muted">
                        Cargando ingredientes y pasos...
                    </p>
                ) : version ? (
                    <>
                        <div className="lg:grid lg:grid-cols-2 lg:gap-8 py-5 border-t border-border">
                            <div>
                                <p className="section-label mb-4">Ingredientes</p>
                                <div className="card p-5 space-y-3">
                                    {[...version.ingredients]
                                        .sort((a, b) => a.orderIndex - b.orderIndex)
                                        .map((ingredient) => (
                                            <div
                                                key={ingredient.id}
                                                className="flex justify-between items-baseline gap-4 text-sm"
                                            >
                                                <span className="text-text">{ingredient.name}</span>
                                                <span className="font-mono text-xs text-text-muted shrink-0">
                                                    {ingredient.quantity} {ingredient.unit}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            <div className="pt-5 lg:pt-0">
                                <p className="section-label mb-4">Preparación</p>
                                <div className="card p-5 space-y-4">
                                    {[...version.steps]
                                        .sort((a, b) => a.order - b.order)
                                        .map((step, index) => (
                                            <div key={step.id} className="flex gap-3">
                                                <span className="flex items-center justify-center size-6 bg-accent/10 text-accent-strong rounded-full text-xs font-serif font-semibold shrink-0 mt-0.5">
                                                    {index + 1}
                                                </span>
                                                <p className="text-sm text-text-muted leading-relaxed pt-0.5">
                                                    {step.description}
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>

                        {(version.rating || version.notes) && (
                            <div className="py-5 border-t border-border">
                                <p className="section-label mb-3">Notas de la versión</p>
                                <div className="card p-5 space-y-3">
                                    {version.rating && (
                                        <p className="text-sm text-text">
                                            Valoración:{" "}
                                            <span className="text-accent-amber font-semibold">
                                                {version.rating}/10
                                            </span>
                                        </p>
                                    )}
                                    {version.notes && (
                                        <p className="text-sm text-text-muted leading-relaxed">
                                            {version.notes}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="py-5 text-sm text-text-muted">
                        No se pudieron cargar los ingredientes y pasos.
                    </p>
                )}
            </div>

            <div className="page-container pb-6">
                <div className="py-5 border-t border-border">
                    <p className="section-label mb-4">Historial de intentos</p>
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
                                    <div key={attempt.id} className="card-raised p-5">
                                        <div className="flex justify-between items-baseline gap-3 mb-2">
                                            <span className="font-mono text-xs text-accent">
                                                {new Date(attempt.date).toLocaleDateString("es-ES", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                            {attempt.rating ? (
                                                <span className="text-accent-amber text-sm">
                                                    {"★".repeat(attempt.rating)}
                                                    <span className="text-border">
                                                        {"★".repeat(5 - attempt.rating)}
                                                    </span>
                                                </span>
                                            ) : null}
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
                        className="w-full py-3.5 btn-primary"
                    >
                        Registrar intento
                    </button>
                </div>
            </div>
        </div>
    );
}