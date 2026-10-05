import type { Recipe, RecipeVersion } from "../types/recipe";
import { categoryMeta } from "../constants/categories";
import VersionTimeline from "./VersionTimeline";
import FavoriteButton from "./FavoriteButton";
import RecipeStatusBadge from "./RecipeStatusBadge";

interface RecipeDetailProps {
    recipe: Recipe;
    version: RecipeVersion | null;
    isVersionLoading: boolean;
    versions: RecipeVersion[];
    currentVersionId: string;
    selectedVersionId: string;
    isTimelineLoading: boolean;
    onSelectVersion: (version: RecipeVersion) => void;
    onBackToCurrentVersion: () => void;
    onEdit: (recipe: Recipe) => void;
    onToggleFavorite: (recipe: Recipe) => void;
    onBack: () => void;
    onNewVersion: () => void;
}

export default function RecipeDetail({
    recipe,
    version,
    isVersionLoading,
    versions,
    currentVersionId,
    selectedVersionId,
    isTimelineLoading,
    onSelectVersion,
    onBackToCurrentVersion,
    onEdit,
    onToggleFavorite,
    onBack,
    onNewVersion,
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

    const isViewingOldVersion =
        selectedVersionId !== currentVersionId && versions.length > 1;

    return (
        <div className="pb-24 md:pb-8">
            <div className="page-container pt-4 flex items-center justify-between">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center gap-1.5 p-2 -ml-2 text-on-surface-variant hover:text-on-surface transition-colors"
                    aria-label="Volver"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    <span className="text-sm">Recetas</span>
                </button>
                <div className="flex items-center gap-1">
                    <FavoriteButton
                        favorite={recipe.favorite}
                        onToggle={() => onToggleFavorite(recipe)}
                    />
                    <button
                        type="button"
                        onClick={() => onEdit(recipe)}
                        className="text-sm text-primary hover:underline transition-colors"
                    >
                        Editar
                    </button>
                </div>
            </div>

            <div className="page-container py-5 md:py-8">
                <p className="section-label mb-3">
                    {meta.emoji} {meta.label}
                </p>
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight mb-4">
                    {recipe.title}
                </h1>
                {recipe.description && (
                    <p className="text-on-surface-variant text-base md:text-lg leading-relaxed max-w-2xl">
                        {recipe.description}
                    </p>
                )}
                <p className="text-xs text-on-surface-variant mt-4">
                    {version && (
                        <>
                            <span className="text-primary font-medium">
                                v{version.versionNumber}
                            </span>
                            <span className="mx-1.5" aria-hidden="true">·</span>
                        </>
                    )}
                    Creada {createdLabel}
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    Actualizada {updatedLabel}
                </p>

                <div className="mt-3">
                    <RecipeStatusBadge status={recipe.status} />
                </div>

                <button
                    type="button"
                    onClick={onNewVersion}
                    className="hidden md:block mt-8 max-w-xs py-3 btn-primary"
                >
                    Nueva versión
                </button>
            </div>

            {/* Banner: viewing historical version */}
            {isViewingOldVersion && (
                <div className="page-container">
                    <div className="flex items-center justify-between gap-3 border-l-2 border-primary/40 pl-3 py-1 mb-6">
                        <p className="text-sm text-on-surface-variant">
                            Viendo la versión{" "}
                            <span className="text-primary font-medium">
                                v{version?.versionNumber}
                            </span>
                        </p>
                        <button
                            type="button"
                            onClick={onBackToCurrentVersion}
                            className="text-sm text-primary hover:underline shrink-0"
                        >
                            Volver a la actual
                        </button>
                    </div>
                </div>
            )}

            <div className="page-container">
                <div
                    className={
                        versions.length > 1
                            ? "lg:grid lg:grid-cols-[12rem_1fr] lg:gap-8"
                            : ""
                    }
                >
                    {/* Timeline sidebar — desktop */}
                    {versions.length > 1 && (
                        <aside className="hidden lg:block">
                            <VersionTimeline
                                versions={versions}
                                currentVersionId={currentVersionId}
                                selectedVersionId={selectedVersionId}
                                onSelectVersion={onSelectVersion}
                                isLoading={isTimelineLoading}
                            />
                        </aside>
                    )}

                    {/* Main content */}
                    <div className="pb-6 min-w-0">
                        {/* Timeline — mobile (collapsible accordion) */}
                        {versions.length > 1 && (
                            <div className="lg:hidden mb-4">
                                <VersionTimeline
                                    versions={versions}
                                    currentVersionId={currentVersionId}
                                    selectedVersionId={selectedVersionId}
                                    onSelectVersion={onSelectVersion}
                                    isLoading={isTimelineLoading}
                                    collapsible
                                />
                            </div>
                        )}

                        {isVersionLoading ? (
                            <p className="py-5 text-sm text-on-surface-variant">
                                Cargando ingredientes y pasos...
                            </p>
                        ) : version ? (
                            <>
                                <div className="lg:grid lg:grid-cols-2 lg:gap-12 py-7 border-t border-outline-variant/40">
                                    <div>
                                        <p className="section-label mb-4">
                                            Ingredientes
                                        </p>
                                        <ul className="space-y-2.5">
                                            {[...version.ingredients]
                                                .sort(
                                                    (a, b) =>
                                                        a.orderIndex -
                                                        b.orderIndex
                                                )
                                                .map((ingredient) => (
                                                    <li
                                                        key={ingredient.id}
                                                        className="flex justify-between items-baseline gap-4 text-sm"
                                                    >
                                                        <span className="text-on-surface">
                                                            {ingredient.name}
                                                        </span>
                                                        <span className="text-xs text-on-surface-variant shrink-0 tabular-nums">
                                                            {
                                                                ingredient.quantity
                                                            }{" "}
                                                            {ingredient.unit}
                                                        </span>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>

                                    <div className="mt-7 pt-7 border-t border-outline-variant/40 lg:mt-0 lg:pt-0 lg:border-t-0">
                                        <p className="section-label mb-4">
                                            Preparación
                                        </p>
                                        <ol className="space-y-3.5">
                                            {[...version.steps]
                                                .sort(
                                                    (a, b) => a.order - b.order
                                                )
                                                .map((step, index) => (
                                                    <li
                                                        key={step.id}
                                                        className="flex gap-3"
                                                    >
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
                                    <div className="py-7 border-t border-outline-variant/40">
                                        <p className="section-label mb-3">
                                            Notas de la versión
                                        </p>
                                        <div className="space-y-2">
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
                                    </div>
                                )}

                                {version.summaryChanges && (
                                    <div className="py-7 border-t border-outline-variant/40">
                                        <p className="section-label mb-3">
                                            Cambios en esta versión
                                        </p>
                                        <p className="text-sm text-on-surface-variant leading-relaxed">
                                            {version.summaryChanges}
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="py-5 text-sm text-on-surface-variant">
                                No se pudieron cargar los ingredientes y pasos.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="fixed-bar md:hidden">
                <div className="page-container">
                    <button
                        type="button"
                        onClick={onNewVersion}
                        className="w-full py-3.5 btn-primary"
                    >
                        Nueva versión
                    </button>
                </div>
            </div>
        </div>
    );
}
