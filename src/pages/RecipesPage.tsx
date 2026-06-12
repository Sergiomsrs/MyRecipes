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
        <div className="min-h-screen bg-gray-50">
            {currentView === "list" && (
                <>
                    {/* Header */}
                    <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                        <div className="px-4 py-5 flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">AppRecetas</h1>
                                <p className="text-xs text-gray-500 mt-1 font-medium">Tu recetario personal</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-emerald-600">{recipes.length}</div>
                                <p className="text-xs text-gray-500 font-medium">receta{recipes.length !== 1 ? "s" : ""}</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="pt-4 pb-24">
                        <RecipeList
                            recipes={recipes}
                            onView={handleViewRecipe}
                            onEdit={handleEditRecipe}
                            onDelete={handleDeleteRecipe}
                        />
                    </div>

                    {/* Floating Action Button */}
                    <button
                        onClick={() => setCurrentView("create")}
                        className="fixed bottom-6 right-4 w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-full shadow-xl hover:shadow-2xl hover:shadow-emerald-500/50 transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center text-3xl font-bold z-20"
                    >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </>
            )}

            {currentView === "create" && (
                <>
                    {/* Header */}
                    <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm px-4 py-3 flex items-center justify-between">
                        <h1 className="text-lg font-bold text-gray-900">Crear receta</h1>
                        <button
                            onClick={() => setCurrentView("list")}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
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

                    {/* Form */}
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
                    {/* Header */}
                    <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm px-4 py-3 flex items-center justify-between">
                        <h1 className="text-lg font-bold text-gray-900">Editar receta</h1>
                        <button
                            onClick={() => setCurrentView("detail")}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
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

                    {/* Form */}
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