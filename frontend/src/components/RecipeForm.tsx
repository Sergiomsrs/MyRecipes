import { useState } from "react";
import type { Recipe, RecipeFormData, Ingredient } from "../types/recipe";

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
        <form onSubmit={handleSubmit} className="page-container pb-6">
            <div className="py-5 border-b border-border">
                <label className="section-label block mb-2">Nombre *</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                    }
                    className="input-field input-field--block text-lg font-semibold"
                    placeholder="Ej: Tortilla de patatas"
                />
            </div>

            <div className="py-5 border-b border-border">
                <label className="section-label block mb-2">Descripción</label>
                <textarea
                    value={formData.description}
                    onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                    }
                    className="input-field input-field--block resize-none"
                    rows={3}
                    placeholder="De dónde viene, qué la hace especial..."
                />
            </div>

            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:border-b lg:border-border">
            <div className="py-5 border-b lg:border-b-0 border-border">
                <h3 className="section-label mb-4">Ingredientes *</h3>
                <div className="space-y-4">
                    {formData.ingredients.map((ingredient) => (
                        <div key={ingredient.id} className="space-y-2">
                            <input
                                type="text"
                                value={ingredient.name}
                                onChange={(e) =>
                                    updateIngredient(ingredient.id, "name", e.target.value)
                                }
                                className="input-field input-field--block"
                                placeholder="Nombre del ingrediente"
                            />
                            <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                                <input
                                    type="text"
                                    value={ingredient.quantity}
                                    onChange={(e) =>
                                        updateIngredient(ingredient.id, "quantity", e.target.value)
                                    }
                                    className="input-field input-field--block"
                                    placeholder="Cantidad"
                                />
                                <input
                                    type="text"
                                    value={ingredient.unit}
                                    onChange={(e) =>
                                        updateIngredient(ingredient.id, "unit", e.target.value)
                                    }
                                    className="input-field input-field--block"
                                    placeholder="Unidad"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeIngredient(ingredient.id)}
                                    className="p-2 text-text-muted active:text-accent-pink transition-colors shrink-0"
                                    aria-label="Eliminar ingrediente"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={addIngredient}
                    className="mt-4 text-sm text-accent font-medium active:opacity-80 transition-opacity"
                >
                    + Añadir ingrediente
                </button>
            </div>

            <div className="py-5 lg:py-5">
                <h3 className="section-label mb-4">Preparación *</h3>
                <div className="space-y-3">
                    {formData.steps
                        .sort((a, b) => a.order - b.order)
                        .map((step, index) => (
                            <div key={step.id} className="flex gap-3 items-start">
                                <span className="flex items-center justify-center size-6 bg-accent/20 text-accent rounded-md text-xs font-mono font-medium shrink-0 mt-2.5">
                                    {index + 1}
                                </span>
                                <textarea
                                    value={step.description}
                                    onChange={(e) => updateStep(step.id, e.target.value)}
                                    className="input-field min-w-0 flex-1 resize-none"
                                    placeholder="Describe este paso"
                                    rows={2}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeStep(step.id)}
                                    className="p-2 text-text-muted active:text-accent-pink transition-colors shrink-0 mt-1.5"
                                    aria-label="Eliminar paso"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                </div>
                <button
                    type="button"
                    onClick={addStep}
                    className="mt-4 text-sm text-accent font-medium active:opacity-80 transition-opacity"
                >
                    + Añadir paso
                </button>
            </div>
            </div>

            <div className="py-5 flex gap-3 md:max-w-md">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-3 text-text-muted font-medium active:text-text transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="flex-1 py-3 btn-gradient"
                >
                    {recipe ? "Guardar" : "Crear receta"}
                </button>
            </div>
        </form>
    );
}
