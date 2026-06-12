import type { Recipe } from "../types/recipe";

interface RecipeDetailProps {
    recipe: Recipe;
    onEdit: (recipe: Recipe) => void;
    onBack: () => void;
    onAddAttempt: () => void;
}

export default function RecipeDetail({
    recipe,
    onEdit,
    onBack,
    onAddAttempt,
}: RecipeDetailProps) {
    return (
        <div className="bg-white pb-24">
            {/* Header */}
            <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-between bg-linear-to-r from-gray-50 to-transparent">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
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
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>
                <button
                    onClick={() => onEdit(recipe)}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                    </svg>
                </button>
            </div>

            {/* Título y descripción */}
            <div className="px-4 py-6 border-b border-gray-200 bg-linear-to-r from-emerald-50 to-transparent">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.name}</h1>
                {recipe.description && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{recipe.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a1 1 0 100 2H5a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2V9a2 2 0 00-2-2h-1a1 1 0 100-2h1a4 4 0 014 4v8a4 4 0 01-4 4H4a4 4 0 01-4-4V5z" clipRule="evenodd"></path></svg>
                        {recipe.attempts.length} intento{recipe.attempts.length !== 1 ? "s" : ""}
                    </span>
                    {recipe.attempts.length > 0 && (
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v2h16V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h.01a1 1 0 000-2H6zm2 0a1 1 0 100 2h.01a1 1 0 100-2H8zm2 0a1 1 0 000 2h.01a1 1 0 000-2h-.01zm2 0a1 1 0 100 2h.01a1 1 0 100-2h-.01zm2 0a1 1 0 000 2h.01a1 1 0 000-2h-.01zM4 15a2 2 0 00-2 2v2h16v-2a2 2 0 00-2-2H4z" clipRule="evenodd"></path></svg>
                            {new Date(recipe.attempts[recipe.attempts.length - 1].date).toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                    )}
                </div>
            </div>

            {/* Ingredientes */}
            <div className="px-4 py-6 border-b border-gray-200">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1h7.586a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.447l-.89-3.559A1 1 0 005 2H3z"></path></svg>
                    Ingredientes
                </h2>
                <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient) => (
                        <li key={ingredient.id} className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 flex justify-between items-center hover:bg-emerald-50 transition-colors">
                            <span className="font-medium">{ingredient.name}</span>
                            <span className="text-gray-500 text-xs font-semibold bg-white px-2 py-1 rounded">
                                {ingredient.quantity} <span className="text-gray-400">{ingredient.unit}</span>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Pasos */}
            <div className="px-4 py-6 border-b border-gray-200">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a1 1 0 100 2H5a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2V9a2 2 0 00-2-2h-1a1 1 0 100-2h1a4 4 0 014 4v8a4 4 0 01-4 4H4a4 4 0 01-4-4V5z" clipRule="evenodd"></path></svg>
                    Pasos de preparación
                </h2>
                <ol className="space-y-3">
                    {recipe.steps
                        .sort((a, b) => a.order - b.order)
                        .map((step, index) => (
                            <li key={step.id} className="flex gap-3 group">
                                <span className="flex items-center justify-center w-7 h-7 bg-linear-to-br from-emerald-400 to-emerald-600 text-white rounded-full text-xs font-bold shrink-0 group-hover:scale-110 transition-transform">
                                    {index + 1}
                                </span>
                                <p className="text-sm text-gray-700 pt-1 leading-relaxed">{step.description}</p>
                            </li>
                        ))}
                </ol>
            </div>

            {/* Historial de intentos */}
            {recipe.attempts.length > 0 && (
                <div className="px-4 py-6">
                    <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 100-2H6a5 5 0 000 10h7.75l-1.422 1.422a1 1 0 101.416 1.416l3-3a1 1 0 000-1.416l-3-3a1 1 0 10-1.416 1.416L13.75 9H6a3 3 0 01-3-3z" clipRule="evenodd"></path></svg>
                        Historial de intentos
                    </h2>
                    <div className="space-y-3">
                        {recipe.attempts
                            .sort(
                                (a, b) =>
                                    new Date(b.date).getTime() - new Date(a.date).getTime()
                            )
                            .map((attempt) => (
                                <div
                                    key={attempt.id}
                                    className="bg-linear-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg p-4 text-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start gap-3 mb-2">
                                        <span className="font-semibold text-gray-800">
                                            {new Date(attempt.date).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
                                        </span>
                                        {attempt.rating && (
                                            <span className="text-lg tracking-wide">
                                                {"⭐".repeat(attempt.rating)}<span className="text-gray-300">{"⭐".repeat(5 - attempt.rating)}</span>
                                            </span>
                                        )}
                                    </div>
                                    {attempt.notes && (
                                        <p className="text-gray-700 leading-relaxed">{attempt.notes}</p>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Botón agregar intento */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 max-w-md mx-auto">
                <button
                    onClick={onAddAttempt}
                    className="w-full py-4 bg-linear-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-lg"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"></path>
                    </svg>
                    Registrar intento
                </button>
            </div>
        </div>
    );
}
