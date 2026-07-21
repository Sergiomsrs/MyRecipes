import { useState } from "react";
import type { Recipe, RecipeFormData } from "../types/recipe";
import { useRecipes } from "../hooks/useRecipes";
import RecipeList from "../components/RecipeList";
import RecipeForm from "../components/RecipeForm";
import RecipeDetail from "../components/RecipeDetail";
import AttemptModal from "../components/AttemptModal";

type View = "list" | "create" | "detail" | "edit";

export default function RecipesPage() {
    const { recipes, createRecipe, updateRecipe, deleteRecipe, getRecipe, addAttempt } = useRecipes();
    const [currentView, setCurrentView] = useState<View>("list");
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [showAttemptModal, setShowAttemptModal] = useState(false);

    const handleCreateRecipe = (data: RecipeFormData) => {
        createRecipe(data);
        setCurrentView("list");
    };

    const handleUpdateRecipe = (data: RecipeFormData) => {
        if (selectedRecipe) {
            updateRecipe(selectedRecipe.id, data);
            const updatedRecipe = getRecipe(selectedRecipe.id);
            if (updatedRecipe) {
                setSelectedRecipe(updatedRecipe);
            }
            setCurrentView("detail");
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

    const handleDeleteRecipe = (id: string) => {
        deleteRecipe(id);
        setCurrentView("list");
    };

    const handleAddAttempt = (rating?: number, notes?: string) => {
        if (selectedRecipe) {
            addAttempt(selectedRecipe.id, rating, notes);
            const updatedRecipe = getRecipe(selectedRecipe.id);
            if (updatedRecipe) {
                setSelectedRecipe(updatedRecipe);
            }
            setShowAttemptModal(false);
        }
    };

    return (
        <div className="min-h-full bg-bg">
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
                            onClick={() => setCurrentView("list")}
                            className="p-2 text-text-muted hover:text-text active:text-text transition-colors"
                            aria-label="Cerrar"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <RecipeForm
                        onSubmit={handleCreateRecipe}
                        onCancel={() => setCurrentView("list")}
                    />
                </>
            )}

            {currentView === "detail" && selectedRecipe && (
                <>
                    <RecipeDetail
                        recipe={selectedRecipe}
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
                            onClick={() => setCurrentView("detail")}
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
                        onSubmit={handleUpdateRecipe}
                        onCancel={() => setCurrentView("detail")}
                    />
                </>
            )}
        </div>
    );
}
