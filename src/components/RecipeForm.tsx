import { useState } from "react";
import type { Recipe, RecipeFormData, Ingredient, Step } from "../types/recipe";

interface RecipeFormProps {
    recipe?: Recipe;
    onSubmit: (data: RecipeFormData) => void;
    onCancel: () => void;
}

export default function RecipeForm({
    recipe,
    onSubmit,
    onCancel,
}: RecipeFormProps) {
    const [formData, setFormData] = useState<RecipeFormData>({
        name: recipe?.name || "",
        description: recipe?.description || "",
        ingredients: recipe?.ingredients || [
            { id: "1", name: "", quantity: "", unit: "" },
        ],
        steps: recipe?.steps || [{ id: "1", order: 1, description: "" }],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert("El nombre de la receta es obligatorio");
            return;
        }

        if (formData.ingredients.some((ing) => !ing.name.trim())) {
            alert("Todos los ingredientes deben tener un nombre");
            return;
        }

        if (formData.steps.some((step) => !step.description.trim())) {
            alert("Todos los pasos deben tener una descripción");
            return;
        }

        onSubmit({
            ...formData,
            ingredients: formData.ingredients.filter((ing) => ing.name.trim()),
            steps: formData.steps.filter((step) => step.description.trim()),
        });
    };

    const addIngredient = () => {
        const newId = Date.now().toString();
        setFormData({
            ...formData,
            ingredients: [
                ...formData.ingredients,
                { id: newId, name: "", quantity: "", unit: "" },
            ],
        });
    };

    const removeIngredient = (id: string) => {
        setFormData({
            ...formData,
            ingredients: formData.ingredients.filter((ing) => ing.id !== id),
        });
    };

    const updateIngredient = (
        id: string,
        field: keyof Ingredient,
        value: string
    ) => {
        setFormData({
            ...formData,
            ingredients: formData.ingredients.map((ing) =>
                ing.id === id ? { ...ing, [field]: value } : ing
            ),
        });
    };

    const addStep = () => {
        const newOrder = Math.max(...formData.steps.map((s) => s.order), 0) + 1;
        const newId = Date.now().toString();
        setFormData({
            ...formData,
            steps: [
                ...formData.steps,
                { id: newId, order: newOrder, description: "" },
            ],
        });
    };

    const removeStep = (id: string) => {
        setFormData({
            ...formData,
            steps: formData.steps.filter((step) => step.id !== id),
        });
    };

    const updateStep = (id: string, description: string) => {
        setFormData({
            ...formData,
            steps: formData.steps.map((step) =>
                step.id === id ? { ...step, description } : step
            ),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white">
            {/* Nombre */}
            <div className="px-4 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-transparent">
                <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>
                    Nombre de la receta *
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white font-medium"
                    placeholder="Ej: Pasta a la Carbonara"
                />
            </div>

            {/* Descripción */}
            <div className="px-4 py-4 border-b border-gray-200">
                <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                    Descripción
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white resize-none"
                    rows={3}
                    placeholder="Ej: Receta tradicional italiana..."
                />
            </div>

            {/* Ingredientes */}
            <div className="px-4 py-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1h7.586a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.447l-.89-3.559A1 1 0 005 2H3z"></path></svg>
                    Ingredientes *
                </h3>
                <div className="space-y-2">
                    {formData.ingredients.map((ingredient) => (
                        <div key={ingredient.id} className="flex gap-2 items-end">
                            <input
                                type="text"
                                value={ingredient.name}
                                onChange={(e) =>
                                    updateIngredient(ingredient.id, "name", e.target.value)
                                }
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
                                placeholder="Nombre"
                            />
                            <input
                                type="text"
                                value={ingredient.quantity}
                                onChange={(e) =>
                                    updateIngredient(ingredient.id, "quantity", e.target.value)
                                }
                                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
                                placeholder="Cant."
                            />
                            <input
                                type="text"
                                value={ingredient.unit}
                                onChange={(e) =>
                                    updateIngredient(ingredient.id, "unit", e.target.value)
                                }
                                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
                                placeholder="Unidad"
                            />
                            <button
                                type="button"
                                onClick={() => removeIngredient(ingredient.id)}
                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={addIngredient}
                    className="mt-3 w-full py-2 px-4 border-2 border-dashed border-emerald-300 text-emerald-700 rounded-lg hover:bg-emerald-50 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Agregar ingrediente
                </button>
            </div>

            {/* Pasos */}
            <div className="px-4 py-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a1 1 0 100 2H5a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2V9a2 2 0 00-2-2h-1a1 1 0 100-2h1a4 4 0 014 4v8a4 4 0 01-4 4H4a4 4 0 01-4-4V5z" clipRule="evenodd"></path></svg>
                    Pasos de preparación *
                </h3>
                <div className="space-y-2">
                    {formData.steps
                        .sort((a, b) => a.order - b.order)
                        .map((step, index) => (
                            <div key={step.id} className="flex gap-3 items-start">
                                <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-full text-xs font-bold flex-shrink-0 mt-2">
                                    {index + 1}
                                </span>
                                <textarea
                                    value={step.description}
                                    onChange={(e) => updateStep(step.id, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white resize-none"
                                    placeholder="Descripción del paso"
                                    rows={2}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeStep(step.id)}
                                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg flex-shrink-0 transition-colors mt-2"
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
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        ))}
                </div>
                <button
                    type="button"
                    onClick={addStep}
                    className="mt-3 w-full py-2 px-4 border-2 border-dashed border-emerald-300 text-emerald-700 rounded-lg hover:bg-emerald-50 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Agregar paso
                </button>
            </div>

            {/* Botones */}
            <div className="px-4 py-4 flex gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:scale-105"
                >
                    {recipe ? "Actualizar" : "Crear"} receta
                </button>
            </div>
        </form>
    );
}
