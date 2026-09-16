import type { Recipe, RecipeVersion } from "../types/recipe";
import { categoryMeta } from "../constants/categories";
import VersionTimeline from "./VersionTimeline";

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
                    <span className="text-sm font-medium">Recetas</span>
                </button>
                <button
                    type="button"
                    onClick={() => onEdit(recipe)}
                    className="text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
                >
                    Editar
                </button>
            </div>

            <div className="page-container py-5 md:py-8">
                <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mb-4 ${meta.bgClass}`}
                >
                    {meta.emoji} {meta.label}
                </span>
                <h1 className="font-serif font-semibold text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight mb-5">
                    {recipe.title}
                </h1>
                {recipe.description && (
                    <p className="text-on-surface-variant text-base md:text-lg leading-relaxed max-w-2xl">
                        {recipe.description}
                    </p>
                )}
                <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-on-surface-variant mt-5">
                    {version && (
                        <span className="inline-flex items-center gap-1">
                            <span className="px-1.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant font-semibold">
                                v{version.versionNumber}
                            </span>
                        </span>
                    )}
                    <span aria-hidden="true">·</span>
                    <span>Creada {createdLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>Actualizada {updatedLabel}</span>
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
                    <div className="flex items-center justify-between gap-3 bg-tertiary-fixed/40 border border-tertiary/20 rounded-xl px-4 py-3 mb-4">
                        <p className="text-sm text-on-surface">
                            Viendo versión{" "}
                            <span className="font-mono font-semibold">
                                v{version?.versionNumber}
                            </span>
                        </p>
                        <button
                            type="button"
                            onClick={onBackToCurrentVersion}
                            className="text-sm font-semibold text-primary hover:underline shrink-0"
                        >
                            Volver a la actual
                        </button>
                    </div>
                </div>
            )}

            <div className="page-container">
                <div className="lg:grid lg:grid-cols-[12rem_1fr] lg:gap-8">
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
                        {/* Timeline — mobile (compact) */}
                        {versions.length > 1 && (
                            <div className="lg:hidden mb-4">
                                <VersionTimeline
                                    versions={versions}
                                    currentVersionId={currentVersionId}
                                    selectedVersionId={selectedVersionId}
                                    onSelectVersion={onSelectVersion}
                                    isLoading={isTimelineLoading}
                                />
                            </div>
                        )}

                        {isVersionLoading ? (
                            <p className="py-5 text-sm text-on-surface-variant">
                                Cargando ingredientes y pasos...
                            </p>
                        ) : version ? (
                            <>
                                <div className="lg:grid lg:grid-cols-2 lg:gap-8 py-5 border-t border-outline-variant">
                                    <div>
                                        <p className="section-label mb-4">
                                            Ingredientes
                                        </p>
                                        <div className="card p-5 space-y-3">
                                            {[...version.ingredients]
                                                .sort(
                                                    (a, b) =>
                                                        a.orderIndex -
                                                        b.orderIndex
                                                )
                                                .map((ingredient) => (
                                                    <div
                                                        key={ingredient.id}
                                                        className="flex justify-between items-baseline gap-4 text-sm"
                                                    >
                                                        <span className="text-on-surface">
                                                            {ingredient.name}
                                                        </span>
                                                        <span className="font-mono text-xs text-on-surface-variant shrink-0">
                                                            {
                                                                ingredient.quantity
                                                            }{" "}
                                                            {ingredient.unit}
                                                        </span>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    <div className="pt-5 lg:pt-0">
                                        <p className="section-label mb-4">
                                            Preparación
                                        </p>
                                        <div className="card p-5 space-y-4">
                                            {[...version.steps]
                                                .sort(
                                                    (a, b) => a.order - b.order
                                                )
                                                .map((step, index) => (
                                                    <div
                                                        key={step.id}
                                                        className="flex gap-3"
                                                    >
                                                        <span className="flex items-center justify-center size-6 bg-primary-fixed text-primary rounded-full text-xs font-serif font-semibold shrink-0 mt-0.5">
                                                            {index + 1}
                                                        </span>
                                                        <p className="text-sm text-on-surface-variant leading-relaxed pt-0.5">
                                                            {step.description}
                                                        </p>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>

                                {(version.rating || version.notes) && (
                                    <div className="py-5 border-t border-outline-variant">
                                        <p className="section-label mb-3">
                                            Notas de la versión
                                        </p>
                                        <div className="card p-5 space-y-3">
                                            {version.rating && (
                                                <p className="text-sm text-on-surface">
                                                    Valoración:{" "}
                                                    <span className="text-tertiary font-semibold">
                                                        {version.rating}/10
                                                    </span>
                                                </p>
                                            )}
                                            {version.notes && (
                                                <p className="text-sm text-on-surface-variant leading-relaxed italic">
                                                    &ldquo;{version.notes}
                                                    &rdquo;
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {version.summaryChanges && (
                                    <div className="py-5 border-t border-outline-variant">
                                        <p className="section-label mb-3">
                                            Cambios en esta versión
                                        </p>
                                        <div className="card p-5">
                                            <p className="text-sm text-on-surface-variant leading-relaxed">
                                                {version.summaryChanges}
                                            </p>
                                        </div>
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
