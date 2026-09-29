import { useState, useEffect, useCallback } from "react";
import type { Recipe, RecipeFormData, RecipeVersion } from "../types/recipe";
import { useRecipes } from "../hooks/useRecipes";
import { useAuth } from "../hooks/useAuth";
import RecipeList from "../components/RecipeList";
import RecipeForm from "../components/RecipeForm";
import RecipeDetail from "../components/RecipeDetail";
import NewVersionModal from "../components/NewVersionModal";

type View = "list" | "create" | "detail" | "edit";
type FilterType = "all" | "evolucion" | "definitiva" | "favoritas";

const filterLabels: Record<FilterType, string> = {
    all: "Todas",
    evolucion: "En evolución",
    definitiva: "Versión definitiva",
    favoritas: "Favoritas",
};

export default function RecipesPage() {
    const {
        recipes,
        isLoading,
        error,
        createRecipe,
        updateRecipe,
        deleteRecipe,
        getRecipe,
        getCurrentVersion,
        getVersions,
        createVersion,
    } = useRecipes();
    const { user } = useAuth();
    const [currentView, setCurrentView] = useState<View>("list");
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [currentVersion, setCurrentVersion] = useState<RecipeVersion | null>(null);
    const [isVersionLoading, setIsVersionLoading] = useState(false);
    const [versions, setVersions] = useState<RecipeVersion[]>([]);
    const [selectedVersionId, setSelectedVersionId] = useState<string>("");
    const [isTimelineLoading, setIsTimelineLoading] = useState(false);
    const [showNewVersionModal, setShowNewVersionModal] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<FilterType>("all");

    const handleFabClick = useCallback(() => {
        setFormError(null);
        setCurrentView("create");
    }, []);

    useEffect(() => {
        const handler = () => handleFabClick();
        window.addEventListener("fab-click", handler);
        return () => window.removeEventListener("fab-click", handler);
    }, [handleFabClick]);

    const filteredRecipes = recipes.filter((recipe) => {
        if (activeFilter === "all") return true;
        if (activeFilter === "favoritas") return recipe.category === "DESSERT";
        if (activeFilter === "definitiva")
            return recipe.title.toLowerCase().includes("definitiva") || recipe.category === "MAIN_COURSE";
        if (activeFilter === "evolucion")
            return recipe.title.toLowerCase().includes("evolución") || recipe.category === "STARTER";
        return true;
    });

    const userName = user?.email?.split("@")[0] || "Chef";

    const handleCreateRecipe = async (data: RecipeFormData) => {
        setFormError(null);
        try {
            await createRecipe(data);
            setCurrentView("list");
        } catch (err) {
            setFormError(err instanceof Error ? err.message : "No se pudo crear la receta");
        }
    };

    const handleUpdateRecipe = async (data: RecipeFormData) => {
        setFormError(null);
        if (!selectedRecipe) return;
        try {
            await updateRecipe(selectedRecipe.id, data);
            setSelectedRecipe(getRecipe(selectedRecipe.id) || null);
            setCurrentView("detail");
        } catch (err) {
            setFormError(err instanceof Error ? err.message : "No se pudo guardar la receta");
        }
    };

    const handleViewRecipe = async (recipe: Recipe) => {
        setSelectedRecipe(recipe);
        setCurrentVersion(null);
        setVersions([]);
        setSelectedVersionId("");
        setCurrentView("detail");
        setIsVersionLoading(true);
        setIsTimelineLoading(true);
        try {
            const [version, allVersions] = await Promise.all([
                getCurrentVersion(recipe.id),
                getVersions(recipe.id),
            ]);
            setCurrentVersion(version);
            setSelectedVersionId(version.id);
            setVersions(allVersions);
        } catch (err) {
            setFormError(
                err instanceof Error ? err.message : "No se pudo cargar la receta completa"
            );
        } finally {
            setIsVersionLoading(false);
            setIsTimelineLoading(false);
        }
    };

    const handleSelectVersion = (version: RecipeVersion) => {
        setSelectedVersionId(version.id);
        setCurrentVersion(version);
    };

    const handleBackToCurrentVersion = async () => {
        if (!selectedRecipe) return;
        setIsVersionLoading(true);
        try {
            const version = await getCurrentVersion(selectedRecipe.id);
            setCurrentVersion(version);
            setSelectedVersionId(version.id);
        } catch (err) {
            setFormError(
                err instanceof Error ? err.message : "No se pudo cargar la versión actual"
            );
        } finally {
            setIsVersionLoading(false);
        }
    };

    const handleEditRecipe = (recipe: Recipe) => {
        setSelectedRecipe(recipe);
        setCurrentView("edit");
    };

    const handleDeleteRecipe = async (id: string) => {
        setFormError(null);
        try {
            await deleteRecipe(id);
            setCurrentView("list");
        } catch (err) {
            setFormError(err instanceof Error ? err.message : "No se pudo eliminar la receta");
        }
    };

    const handleCreateVersion = async (summaryChanges: string, data: RecipeFormData) => {
        setFormError(null);
        if (!selectedRecipe) return;
        try {
            const newVersion = await createVersion(selectedRecipe.id, summaryChanges, data);
            setCurrentVersion(newVersion);
            setSelectedVersionId(newVersion.id);
            setVersions((current) => [...current, newVersion]);
            setShowNewVersionModal(false);
        } catch (err) {
            setFormError(err instanceof Error ? err.message : "No se pudo crear la nueva versión");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-full bg-surface flex items-center justify-center py-24">
                <p className="text-on-surface-variant">Cargando recetas...</p>
            </div>
        );
    }

    if (error && currentView === "list") {
        return (
            <div className="min-h-full bg-surface">
                <div className="page-container pt-16 flex flex-col items-center justify-center text-center">
                    <p className="font-serif text-lg text-on-surface mb-2">
                        No se pudieron cargar las recetas
                    </p>
                    <p className="text-sm text-error border-l-2 border-error/50 pl-3 mb-6">
                        {error}
                    </p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="px-5 py-2.5 btn-primary"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-surface">
            {formError && (
                <div className="page-container pt-4">
                    <p className="text-sm text-error border-l-2 border-error/50 pl-3">
                        {formError}
                    </p>
                </div>
            )}

            {currentView === "list" && (
                <>
                    <div className="page-container pt-3 pb-24 space-y-5">
                        {/* Saludo y Resumen */}
                        <section className="flex flex-col">
                            <h1 className="font-serif text-2xl text-on-surface">
                                Hola, {userName}
                            </h1>
                            <p className="text-sm text-on-surface-variant mt-0.5">
                                {recipes.length} receta{recipes.length !== 1 ? "s" : ""} en
                                tu cuaderno
                            </p>
                        </section>

                        {/* Filtros */}
                        <section>
                            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                                {(Object.keys(filterLabels) as FilterType[]).map((key) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setActiveFilter(key)}
                                        className={`shrink-0 text-sm pb-0.5 border-b transition-colors ${
                                            activeFilter === key
                                                ? "text-primary border-primary font-medium"
                                                : "text-on-surface-variant border-transparent hover:text-on-surface"
                                        }`}
                                    >
                                        {filterLabels[key]}{" "}
                                        {key === "all"
                                            ? recipes.length
                                            : recipes.filter((r) => {
                                                  if (key === "favoritas")
                                                      return r.category === "DESSERT";
                                                  if (key === "definitiva")
                                                      return (
                                                          r.title
                                                              .toLowerCase()
                                                              .includes("definitiva") ||
                                                          r.category === "MAIN_COURSE"
                                                      );
                                                  if (key === "evolucion")
                                                      return (
                                                          r.title
                                                              .toLowerCase()
                                                              .includes("evolución") ||
                                                          r.category === "STARTER"
                                                      );
                                                  return true;
                                              }).length}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Listado de Recetas */}
                        <section className="flex flex-col space-y-4">
                            <div className="flex items-baseline justify-between">
                                <h3 className="font-serif text-lg text-on-surface">
                                    Recetas
                                    <span className="text-on-surface-variant text-sm ml-1.5">
                                        {filteredRecipes.length}
                                    </span>
                                </h3>
                                <button
                                    type="button"
                                    className="text-xs text-on-surface-variant flex items-center gap-0.5 hover:text-on-surface transition-colors"
                                >
                                    <span>Ordenar: Recientes</span>
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <RecipeList
                                recipes={filteredRecipes}
                                onView={handleViewRecipe}
                                onEdit={handleEditRecipe}
                                onDelete={handleDeleteRecipe}
                            />
                        </section>

                        {/* Nueva receta */}
                        <section>
                            <div className="border-t border-outline-variant/40 pt-5 flex items-center justify-between gap-4">
                                <p className="text-sm text-on-surface-variant max-w-xs">
                                    ¿Nuevo experimento? Registra cada versión desde el
                                    día 1.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleFabClick}
                                    className="shrink-0 h-10 px-4 rounded-lg bg-primary text-on-primary text-sm font-medium flex items-center gap-1.5 hover:brightness-105 transition-[filter]"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                    <span>Nueva receta</span>
                                </button>
                            </div>
                        </section>
                    </div>
                </>
            )}

            {currentView === "create" && (
                <>
                    <div className="page-container pt-4 flex items-center justify-between">
                        <h1 className="font-serif text-xl text-on-surface">
                            Nueva receta
                        </h1>
                        <button
                            type="button"
                            onClick={() => {
                                setFormError(null);
                                setCurrentView("list");
                            }}
                            className="p-2 text-on-surface-variant hover:text-on-surface transition-colors"
                            aria-label="Cerrar"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <RecipeForm
                        mode="create"
                        onSubmit={handleCreateRecipe}
                        onCancel={() => {
                            setFormError(null);
                            setCurrentView("list");
                        }}
                    />
                </>
            )}

            {currentView === "detail" && selectedRecipe && (
                <>
                    <RecipeDetail
                        recipe={selectedRecipe}
                        version={currentVersion}
                        isVersionLoading={isVersionLoading}
                        versions={versions}
                        currentVersionId={currentVersion?.id || ""}
                        selectedVersionId={selectedVersionId}
                        isTimelineLoading={isTimelineLoading}
                        onSelectVersion={handleSelectVersion}
                        onBackToCurrentVersion={handleBackToCurrentVersion}
                        onEdit={handleEditRecipe}
                        onBack={() => setCurrentView("list")}
                        onNewVersion={() => setShowNewVersionModal(true)}
                    />
                    {currentVersion && (
                        <NewVersionModal
                            isOpen={showNewVersionModal}
                            currentVersion={currentVersion}
                            onClose={() => setShowNewVersionModal(false)}
                            onSubmit={handleCreateVersion}
                        />
                    )}
                </>
            )}

            {currentView === "edit" && selectedRecipe && (
                <>
                    <div className="page-container pt-4 flex items-center justify-between">
                        <h1 className="font-serif text-xl text-on-surface">
                            Editar receta
                        </h1>
                        <button
                            type="button"
                            onClick={() => {
                                setFormError(null);
                                setCurrentView("detail");
                            }}
                            className="p-2 text-on-surface-variant hover:text-on-surface transition-colors"
                            aria-label="Cerrar"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    <RecipeForm
                        recipe={selectedRecipe}
                        mode="edit"
                        onSubmit={handleUpdateRecipe}
                        onCancel={() => {
                            setFormError(null);
                            setCurrentView("detail");
                        }}
                    />
                </>
            )}
        </div>
    );
}
