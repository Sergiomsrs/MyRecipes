import type { Recipe } from "../types/recipe";

interface RecipeListProps {
    recipes: Recipe[];
    onView: (recipe: Recipe) => void;
    onEdit: (recipe: Recipe) => void;
    onDelete: (id: string) => void;
}

export default function RecipeList({
    recipes,
    onView,
    onEdit,
    onDelete,
}: RecipeListProps) {
    if (recipes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="mb-4">
                    <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747S17.5 6.253 12 6.253z" />
                    </svg>
                </div>
                <p className="text-gray-500 text-lg font-semibold mb-2">Sin recetas aún</p>
                <p className="text-gray-400 text-sm">
                    Crea tu primera receta para comenzar a registrar tu experiencia culinaria
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3 px-4">
            {recipes.map((recipe, index) => (
                <div
                    key={recipe.id}
                    onClick={() => onView(recipe)}
                    className="group relative bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg hover:border-emerald-300 transition-all duration-300 cursor-pointer hover:scale-105 transform"
                >
                    {/* Background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 pointer-events-none"></div>
                    
                    <div className="relative flex items-center justify-between">
                        <div className="flex-1">
                            {/* Número de receta */}
                            <div className="flex items-center gap-2 mb-2">
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                                    {index + 1}
                                </span>
                                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Receta</span>
                            </div>
                            
                            {/* Nombre */}
                            <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-emerald-700 transition-colors">
                                {recipe.name}
                            </h3>
                            
                            {/* Metadatos */}
                            <div className="flex flex-wrap gap-4 text-xs">
                                <div className="flex items-center gap-1 text-gray-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span><strong>{recipe.attempts.length}</strong> intento{recipe.attempts.length !== 1 ? "s" : ""}</span>
                                </div>
                                {recipe.attempts.length > 0 && (
                                    <div className="flex items-center gap-1 text-gray-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{new Date(recipe.attempts[recipe.attempts.length - 1].date).toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" })}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex gap-2 ml-4 flex-shrink-0">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(recipe);
                                }}
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors group/btn"
                                title="Editar"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm(`¿Eliminar la receta "${recipe.name}"?`)) {
                                        onDelete(recipe.id);
                                    }
                                }}
                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Eliminar"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
