import type { Recipe, RecipeVersion } from "../types/recipe";
import { useState } from "react";
import { categoryMeta } from "../constants/categories";

interface RecipeCardProps {
    recipe: Recipe;
    version?: RecipeVersion | null;
    error?: string;
    onShare?: (recipe: Recipe, version?: RecipeVersion | null) => void;
}

export default function RecipeCard({ recipe, version, error, onShare }: RecipeCardProps) {
    const [copied, setCopied] = useState(false);
    const meta = categoryMeta[recipe.category];
    const updatedLabel = new Date(recipe.updatedAt).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <article className="recipe-sheet bg-surface-container-lowest border border-outline-variant/40 rounded-lg p-5 md:p-6 break-inside-avoid">
            {version && version.photos.length > 0 && (
                <img
                    src={version.photos[0].url}
                    alt={version.photos[0].caption || recipe.title}
                    className="w-full aspect-[4/3] object-cover rounded-md mb-4"
                />
            )}

            <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-baseline gap-3">
                    <p className="section-label">
                        {meta.emoji} {meta.label}
                    </p>
                    {version && (
                        <p className="text-xs text-primary font-medium tabular-nums">
                            v{version.versionNumber}
                        </p>
                    )}
                </div>
                <button
                    type="button"
                    aria-label="Compartir receta como imagen"
                    className="p-1.5 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60 transition-colors disabled:opacity-60"
                    disabled={copied}
                    onClick={() => {
                        if (onShare) {
                            onShare(recipe, version);
                        }
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1200);
                    }}
                >
                    {copied ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <circle cx="18" cy="5" r="3" />
                            <circle cx="6" cy="12" r="3" />
                            <circle cx="18" cy="19" r="3" />
                            <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                            <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
                        </svg>
                    )}
                </button>
            </div>

            <h2 className="font-serif text-xl tracking-tight leading-snug text-on-surface mb-1.5">
                {recipe.title}
            </h2>
            {recipe.description && (
                <p className="text-sm text-on-surface-variant leading-relaxed">
                    {recipe.description}
                </p>
            )}

            {error && (
                <p className="text-sm text-error border-l-2 border-error/50 pl-3 mt-4">
                    {error}
                </p>
            )}

            {version && (
                <>
                    <div className="border-t border-outline-variant/40 my-4" />

                    <div className="space-y-4">
                        <div>
                            <p className="section-label mb-2.5">Ingredientes</p>
                            <ul className="space-y-2">
                                {[...version.ingredients]
                                    .sort(
                                        (a, b) => a.orderIndex - b.orderIndex
                                    )
                                    .map((ingredient) => (
                                        <li
                                            key={ingredient.id}
                                            className="flex justify-between items-baseline gap-3 text-sm"
                                        >
                                            <span className="text-on-surface">
                                                {ingredient.name}
                                            </span>
                                            <span className="text-xs text-on-surface-variant shrink-0 tabular-nums">
                                                {ingredient.quantity}{" "}
                                                {ingredient.unit}
                                            </span>
                                        </li>
                                    ))}
                            </ul>
                        </div>

                        <div>
                            <p className="section-label mb-2.5">Preparación</p>
                            <ol className="space-y-2.5">
                                {[...version.steps]
                                    .sort((a, b) => a.order - b.order)
                                    .map((step, index) => (
                                        <li key={step.id} className="flex gap-3">
                                            <span className="text-xs text-on-surface-variant tabular-nums w-4 shrink-0 pt-0.5">
                                                {index + 1}.
                                            </span>
                                            <p className="text-sm text-on-surface-variant leading-relaxed">
                                                {step.description}
                                            </p>
                                        </li>
                                    ))}
                            </ol>
                        </div>
                    </div>

                    {(version.rating || version.notes) && (
                        <div className="border-t border-outline-variant/40 mt-4 pt-4 space-y-1.5">
                            {version.rating && (
                                <p className="text-sm text-on-surface">
                                    Valoración{" "}
                                    <span className="text-primary font-medium tabular-nums">
                                        {version.rating}/10
                                    </span>
                                </p>
                            )}
                            {version.notes && (
                                <p className="text-sm text-on-surface-variant leading-relaxed">
                                    {version.notes}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="border-t border-outline-variant/40 mt-4 pt-3">
                        <p className="text-xs text-on-surface-variant">
                            Actualizada {updatedLabel}
                            {version.summaryChanges && (
                                <>
                                    <span className="mx-1.5" aria-hidden="true">·</span>
                                    {version.summaryChanges}
                                </>
                            )}
                        </p>
                    </div>
                </>
            )}
        </article>
    );
}