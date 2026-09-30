import { useState, useEffect, useCallback } from "react";
import type { Recipe, RecipeFormData, RecipeVersion } from "../types/recipe";
import {
    useRecipeCurrentVersion,
    useRecipeVersions,
    useRecipesList,
} from "../hooks/useRecipes";
import {
    useCreateRecipe,
    useCreateVersion,
    useDeleteRecipe,
    useUpdateRecipe,
} from "../hooks/useRecipeMutations";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../api/errors";
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
        data: recipes,
        isPending,
        error,
        refetch,
    } = useRecipesList();
    const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
    const [selectedVersionId, setSelectedVersionId] = useState<string>("");
    const currentVersionQuery = useRecipeCurrentVersion(selectedRecipeId ?? "");
    const versionsQuery = useRecipeVersions(selectedRecipeId ?? "");
    const createRecipeMutation = useCreateRecipe();
    const updateRecipeMutation = useUpdateRecipe();
    const deleteRecipeMutation = useDeleteRecipe();
    const createVersionMutation = useCreateVersion();
    const { user } = useAuth();
    const [currentView, setCurrentView] = useState<View>("list");
    const [showNewVersionModal, setShowNewVersionModal] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<FilterType>("all");
    const [sortOrder, setSortOrder] = useState<"recent" | "oldest" | "title">("recent");

    const recipeList = recipes ?? [];
    const selectedRecipe =
        recipeList.find((recipe) => recipe.id === selectedRecipeId) ?? null;
    const versions = versionsQuery.data ?? [];
    const currentVersion = currentVersionQuery.data ?? null;
    const displayedVersion =
        versions.find((version) => version.id === selectedVersionId) ?? null;
    const isViewingDetail = currentView === "detail" && selectedRecipe !== null;
    const isVersionLoading = isViewingDetail && currentVersionQuery.isPending;
    const isTimelineLoading = isViewingDetail && versionsQuery.isPending;
    const currentVersionId =
        currentVersion?.id ?? selectedRecipe?.currentVersionId ?? "";

    const handleFabClick = useCallback(() => {
        setFormError(null);
        setCurrentView("create");
    }, []);

    useEffect(() => {
        const handler = () => handleFabClick();
        window.addEventListener("fab-click", handler);
        return () => window.removeEventListener("fab-click", handler);
    }, [handleFabClick]);

    const filteredRecipes = recipeList.filter((recipe) => {
        if (activeFilter === "all") return true;
        if (activeFilter === "favoritas") return recipe.category === "DESSERT";
        if (activeFilter === "definitiva")
            return recipe.title.toLowerCase().includes("definitiva") || recipe.category === "MAIN_COURSE";
        if (activeFilter === "evolucion")
            return recipe.title.toLowerCase().includes("evolución") || recipe.category === "STARTER";
        return true;
    });

    const visibleRecipes = [...filteredRecipes].sort((a, b) => {
        if (sortOrder === "oldest") {
            return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        }

        if (sortOrder === "title") {
            return a.title.localeCompare(b.title, "es");
        }

        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    const userName = user?.email?.split("@")[0] || "Chef";

    const handleCreateRecipe = async (data: RecipeFormData) => {
        setFormError(null);
        try {
            await createRecipeMutation.mutateAsync(data);
            setCurrentView("list");
        } catch (err) {
            setFormError(getErrorMessage(err, "No se pudo crear la receta"));
        }
    };

    const handleUpdateRecipe = async (data: RecipeFormData) => {
        setFormError(null);
        if (!selectedRecipe) return;
        try {
            await updateRecipeMutation.mutateAsync({ id: selectedRecipe.id, data });
            setCurrentView("detail");
        } catch (err) {
            setFormError(getErrorMessage(err, "No se pudo guardar la receta"));
        }
    };

    const handleViewRecipe = (recipe: Recipe) => {
        setFormError(null);
        setSelectedRecipeId(recipe.id);
        setSelectedVersionId(recipe.currentVersionId);
        setCurrentView("detail");
    };

    const handleSelectVersion = (version: RecipeVersion) => {
        setSelectedVersionId(version.id);
    };

    const handleBackToCurrentVersion = () => {
        const targetId = currentVersion?.id ?? selectedRecipe?.currentVersionId;
        if (targetId) {
            setSelectedVersionId(targetId);
        }
    };

    const handleEditRecipe = (recipe: Recipe) => {
        setFormError(null);
        setSelectedRecipeId(recipe.id);
        setCurrentView("edit");
    };

    const handleBackToList = () => {
        setFormError(null);
        setCurrentView("list");
    };

    const handleBackToDetail = () => {
        setFormError(null);
        setCurrentView("detail");
    };

    const handleDeleteRecipe = async (id: string) => {
        setFormError(null);
        try {
            await deleteRecipeMutation.mutateAsync(id);
            setSelectedRecipeId(null);
            setCurrentView("list");
        } catch (err) {
            setFormError(getErrorMessage(err, "No se pudo eliminar la receta"));
        }
    };

    const handleCreateVersion = async (summaryChanges: string, data: RecipeFormData) => {
        setFormError(null);
        if (!selectedRecipe) return;
        try {
            const newVersion = await createVersionMutation.mutateAsync({
                recipeId: selectedRecipe.id,
                summaryChanges,
                data,
            });
            setSelectedVersionId(newVersion.id);
            setShowNewVersionModal(false);
        } catch (err) {
            setFormError(getErrorMessage(err, "No se pudo crear la nueva versión"));
        }
    };

    if (isPending) {
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
                        {getErrorMessage(error, "No se pudieron cargar las recetas")}
                    </p>
                    <button
                        type="button"
                        onClick={() => void refetch()}
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
                    <div className="page-container max-w-5xl mx-auto px-4 pb-24 pt-6 md:px-6">
                        <header className="border-b border-stone-200/80 pb-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">
                                            Cuaderno personal
                                        </p>
                                        <h1 className="mt-2 font-serif text-3xl leading-none text-stone-900 md:text-4xl">
                                            Hola, {userName}
                                        </h1>
                                    </div>
                                </div>
                            </div>

                            <p className="mt-4 text-sm text-stone-600">
                                {recipeList.length} recetas vivas · {recipeList.length} cocinados
                                documentados
                            </p>
                        </header>

                        <section className="mt-6 rounded-3xl border border-amber-200/70 bg-[#faf6ef] p-4 shadow-sm md:p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1e3d8] text-lg text-[#8a4d2d] shadow-inner">
                                        ✦
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">
                                            Laboratorio de sabores
                                        </p>
                                        <h2 className="mt-1 text-base font-semibold text-stone-800 md:text-lg">
                                            {recipeList.length} recetas afinándose esta semana
                                        </h2>
                                    </div>
                                </div>

                                <div className="rounded-full border border-amber-200 bg-white/60 px-2.5 py-1 text-[11px] font-semibold text-stone-700">
                                    +{Math.max(recipeList.length, 0)} en prueba
                                </div>
                            </div>
                        </section>

                        <section className="mt-6">
                            <div className="flex flex-col gap-4">
                                <div className="inline-flex w-full flex-wrap items-center gap-2 rounded-2xl bg-stone-100 p-1.5 shadow-[inset_0_1px_0_rgba(0,0,0,0.02)] md:w-auto">
                                    {(Object.keys(filterLabels) as FilterType[]).map((key) => {
                                        const count =
                                            key === "all"
                                                ? recipeList.length
                                                : recipeList.filter((r) => {
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
                                                }).length;

                                        const active = activeFilter === key;

                                        return (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setActiveFilter(key)}
                                                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all ${active
                                                    ? "bg-[#c85a32] text-white shadow-sm"
                                                    : "bg-transparent text-stone-600 hover:bg-stone-200/80 hover:text-stone-800"
                                                    }`}
                                            >
                                                <span>{filterLabels[key]}</span>
                                                <span
                                                    className={`inline-flex min-w-[1.4rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${active
                                                        ? "bg-white/20 text-white"
                                                        : "bg-stone-200 text-stone-600"
                                                        }`}
                                                >
                                                    {count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-serif text-2xl text-stone-900">
                                            Recetas en bitácora
                                        </h3>
                                        <span className="inline-flex min-w-[1.7rem] items-center justify-center rounded-full bg-stone-200 px-2 py-0.5 text-xs font-semibold text-stone-700">
                                            {filteredRecipes.length}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <select
                                                aria-label="Ordenar recetas"
                                                value={sortOrder}
                                                onChange={(event) =>
                                                    setSortOrder(
                                                        event.target.value as
                                                        | "recent"
                                                        | "oldest"
                                                        | "title"
                                                    )
                                                }
                                                className="appearance-none rounded-xl border border-stone-200 bg-white px-3 py-2 pr-8 text-sm text-stone-700 shadow-sm outline-none transition focus:border-stone-300"
                                            >
                                                <option value="recent">Ordenar: Recientes</option>
                                                <option value="oldest">Más antiguos</option>
                                                <option value="title">Título A-Z</option>
                                            </select>
                                            <svg
                                                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path d="M5.25 7.5 10 12.25 14.75 7.5H5.25Z" />
                                            </svg>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleFabClick}
                                            className="inline-flex items-center gap-2 rounded-xl bg-[#c85a32] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#b44f2d] focus:outline-none focus:ring-2 focus:ring-[#d58d74]"
                                        >
                                            <svg
                                                className="h-4 w-4"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                aria-hidden="true"
                                            >
                                                <path d="M10 4.5v11M4.5 10h11" strokeLinecap="round" />
                                            </svg>
                                            Nueva receta
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="mt-5">
                            <RecipeList
                                recipes={visibleRecipes}
                                onView={handleViewRecipe}
                                onEdit={handleEditRecipe}
                                onDelete={handleDeleteRecipe}
                            />
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
                            onClick={handleBackToList}
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
                        onCancel={handleBackToList}
                    />
                </>
            )}

            {currentView === "detail" && selectedRecipe && (
                <>
                    <RecipeDetail
                        recipe={selectedRecipe}
                        version={displayedVersion}
                        isVersionLoading={isVersionLoading}
                        versions={versions}
                        currentVersionId={currentVersionId}
                        selectedVersionId={selectedVersionId}
                        isTimelineLoading={isTimelineLoading}
                        onSelectVersion={handleSelectVersion}
                        onBackToCurrentVersion={handleBackToCurrentVersion}
                        onEdit={handleEditRecipe}
                        onBack={handleBackToList}
                        onNewVersion={() => setShowNewVersionModal(true)}
                    />
                    {displayedVersion && (
                        <NewVersionModal
                            isOpen={showNewVersionModal}
                            currentVersion={displayedVersion}
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
                            onClick={handleBackToDetail}
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
                        onCancel={handleBackToDetail}
                    />
                </>
            )}
        </div>
    );
}
