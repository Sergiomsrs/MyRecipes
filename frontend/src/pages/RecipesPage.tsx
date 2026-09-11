import { useState } from "react";
import type { Recipe, RecipeFormData } from "../types/recipe";
import { useRecipes } from "../hooks/useRecipes";
import RecipeList from "../components/RecipeList";
import RecipeForm from "../components/RecipeForm";
import RecipeDetail from "../components/RecipeDetail";
import AttemptModal from "../components/AttemptModal";

type View = "list" | "create" | "detail" | "edit";

export default function RecipesPage() {
    const {
        recipes,
        isLoading,
        error,
        createRecipe,
        updateRecipe,
        deleteRecipe,
        getRecipe,
        attempts,
        addAttempt,
    } = useRecipes();
    const [currentView, setCurrentView] = useState<View>("list");
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [showAttemptModal, setShowAttemptModal] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

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

    const handleViewRecipe = (recipe: Recipe) => {
        setSelectedRecipe(recipe);
        setCurrentView("detail");
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

    const handleAddAttempt = (rating?: number, notes?: string) => {
        if (selectedRecipe) {
            addAttempt(selectedRecipe.id, rating, notes);
            setShowAttemptModal(false);
        }
    };

    const attemptsCount = Object.fromEntries(
        Object.entries(attempts).map(([id, list]) => [id, list.length])
    );

    const selectedAttempts = selectedRecipe ? (attempts[selectedRecipe.id] || []) : [];

    if (isLoading) {
        return (
            <div className="min-h-full bg-bg flex items-center justify-center py-24">
                <p className="text-text-muted">Cargando recetas...</p>
            </div>
        );
    }

    if (error && currentView === "list") {
        return (
            <div className="min-h-full bg-bg">
                <div className="page-container pt-16 flex flex-col items-center justify-center text-center">
                    <div className="size-12 rounded-xl bg-surface border border-border flex items-center justify-center mb-4">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <p className="font-semibold text-text mb-2">
                        No se pudieron cargar las recetas
                    </p>
                    <p className="text-text-muted text-sm leading-relaxed max-w-xs mb-6">
                        {error}
                    </p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="px-5 py-2.5 btn-gradient"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-bg">
            {formError && (
                <div className="page-container pt-4">
                    <p className="text-sm text-accent-pink bg-accent-pink/5 border border-accent-pink/20 rounded-lg px-4 py-2.5">
                        {formError}
                    </p>
                </div>
            )}

            {currentView === "list" && (
                <>
                    <div className="page-container pt-4 md:pt-6 pb-24">
                        <div className="mb-6">
                            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                                <span className="gradient-text">Mis recetas</span>
                            </h1>
                            <p className="font-mono text-xs text-text-muted mt-1">
                                {recipes.length} receta{recipes.length !== 1 ? "s" : ""}
                            </p>
                        </div>

                        <RecipeList
                            recipes={recipes}
                            attemptsCount={attemptsCount}
                            onView={handleViewRecipe}
                            onEdit={handleEditRecipe}
                            onDelete={handleDeleteRecipe}
                        />
                    </div>

                    <div className="fixed bottom-6 left-0 right-0 z-20 pointer-events-none">
                        <div className="page-container flex justify-end pointer-events-auto">
                            <button
                                type="button"
                                onClick={() => setCurrentView("create")}
                                className="size-14 btn-gradient rounded-full shadow-lg shadow-accent/25 flex items-center justify-center"
                                aria-label="Nueva receta"
                            >
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </>
            )}

            {currentView === "create" && (
                <>
                    <div className="page-container pt-4 flex items-center justify-between">
                        <h1 className="text-lg font-semibold text-text">Nueva receta</h1>
                        <button
                            type="button"
                            onClick={() => {
                                setFormError(null);
                                setCurrentView("list");
                            }}
                            className="p-2 text-text-muted hover:text-text active:text-text transition-colors"
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
                        attempts={selectedAttempts}
                        onEdit={handleEditRecipe}
                        onBack={() => setCurrentView("list")}
                        onAddAttempt={() => setShowAttemptModal(true)}
                    />
                    <AttemptModal
                        isOpen={showAttemptModal}
                        onClose={() => setShowAttemptModal(false)}
                        onSubmit={handleAddAttempt}
                    />
                </>
            )}

            {currentView === "edit" && selectedRecipe && (
                <>
                    <div className="page-container pt-4 flex items-center justify-between">
                        <h1 className="text-lg font-semibold text-text">Editar receta</h1>
                        <button
                            type="button"
                            onClick={() => {
                                setFormError(null);
                                setCurrentView("detail");
                            }}
                            className="p-2 text-text-muted hover:text-text active:text-text transition-colors"
                            aria-label="Cerrar"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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