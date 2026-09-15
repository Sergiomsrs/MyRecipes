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
        createVersion,
    } = useRecipes();
    const { user } = useAuth();
    const [currentView, setCurrentView] = useState<View>("list");
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [currentVersion, setCurrentVersion] = useState<RecipeVersion | null>(null);
    const [isVersionLoading, setIsVersionLoading] = useState(false);
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
        setCurrentView("detail");
        setIsVersionLoading(true);
        try {
            const version = await getCurrentVersion(recipe.id);
            setCurrentVersion(version);
        } catch (err) {
            setFormError(
                err instanceof Error ? err.message : "No se pudo cargar la receta completa"
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
                    <div className="size-12 rounded-xl bg-error-container flex items-center justify-center mb-4">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <p className="font-serif font-semibold text-lg text-on-surface mb-2">
                        No se pudieron cargar las recetas
                    </p>
                    <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs mb-6">
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
                    <p className="text-sm text-error bg-error-container/30 rounded-xl px-4 py-3">
                        {formError}
                    </p>
                </div>
            )}

            {currentView === "list" && (
                <>
                    <div className="page-container pt-3 pb-24 space-y-5">
                        {/* Saludo y Resumen */}
                        <section className="flex flex-col">
                            <div className="flex items-baseline justify-between gap-2">
                                <h1 className="font-serif font-semibold text-2xl text-on-surface">
                                    Hola, {userName}
                                </h1>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-mono text-xs font-semibold shrink-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                    Activo
                                </span>
                            </div>
                            <p className="text-sm text-on-surface-variant mt-1">
                                {recipes.length} receta{recipes.length !== 1 ? "s" : ""} en
                                tu cuaderno
                            </p>
                        </section>

                        {/* Filtros Pills */}
                        <section>
                            <div className="flex flex-wrap gap-2">
                                {(Object.keys(filterLabels) as FilterType[]).map((key) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setActiveFilter(key)}
                                        className={`filter-btn shrink-0 px-3 py-1.5 rounded-full font-mono text-xs font-semibold transition-all duration-200 ${
                                            activeFilter === key
                                                ? "bg-primary text-on-primary shadow-sm"
                                                : "bg-surface-container-high text-on-surface hover:bg-surface-container"
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
                        <section className="flex flex-col space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-serif font-semibold text-lg">
                                        Recetas
                                    </h3>
                                    <span className="w-5 h-5 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-mono text-xs font-semibold">
                                        {filteredRecipes.length}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className="font-mono text-xs text-primary font-semibold flex items-center gap-0.5 hover:underline"
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

                        {/* Banner Creación Rápida */}
                        <section>
                            <div className="rounded-2xl bg-gradient-to-r from-primary to-primary-container p-4 text-on-primary shadow-lg flex items-center justify-between gap-3">
                                <div className="flex flex-col min-w-0">
                                    <span className="font-serif font-semibold text-lg leading-tight">
                                        ¿Nuevo experimento?
                                    </span>
                                    <span className="text-sm text-on-primary/85 mt-0.5 hidden sm:block">
                                        Añade ingredientes y registra cada versión desde el día 1.
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleFabClick}
                                    className="shrink-0 h-11 px-4 rounded-xl bg-surface-container-lowest text-primary font-serif font-semibold shadow-md flex items-center gap-1 active:scale-95 transition-transform"
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
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                    <span>Crear</span>
                                </button>
                            </div>
                        </section>
                    </div>
                </>
            )}

            {currentView === "create" && (
                <>
                    <div className="page-container pt-4 flex items-center justify-between">
                        <h1 className="font-serif font-semibold text-xl text-on-surface">
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
                        <h1 className="font-serif font-semibold text-xl text-on-surface">
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
