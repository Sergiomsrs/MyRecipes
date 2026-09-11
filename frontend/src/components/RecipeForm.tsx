import { useState } from "react";
import { categories, categoryMeta } from "../constants/categories";
import type {
    IngredientForm,
    Recipe,
    RecipeFormData,
} from "../types/recipe";

interface RecipeFormProps {
    recipe?: Recipe;
    mode: "create" | "edit";
    onSubmit: (data: RecipeFormData) => void;
    onCancel: () => void;
}

export default function RecipeForm({
    recipe,
    mode,
    onSubmit,
    onCancel,
}: RecipeFormProps) {
    const editing = mode === "edit";
    const [formData, setFormData] = useState<RecipeFormData>({
        title: recipe?.title || "",
        description: recipe?.description || "",
        category: recipe?.category || "MAIN_COURSE",
        ingredients: [
            { id: "1", name: "", quantity: "", unit: "" },
        ],
        steps: [{ id: "1", order: 1, description: "" }],
        notes: "",
        rating: 5,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert("El título de la receta es obligatorio");
            return;
        }

        if (!editing && formData.ingredients.some((ing) => !ing.name.trim())) {
            alert("Todos los ingredientes deben tener un nombre");
            return;
        }

        if (!editing && formData.steps.some((step) => !step.description.trim())) {
            alert("Todos los pasos deben tener una descripción");
            return;
        }

        onSubmit({
            ...formData,
            title: formData.title.trim(),
            description: formData.description.trim(),
            ingredients: editing
                ? formData.ingredients
                : formData.ingredients.filter((ing) => ing.name.trim()),
            steps: editing
                ? formData.steps
                : formData.steps.filter((step) => step.description.trim()),
        });
    };

    const addIngredient = () => {
        setFormData({
            ...formData,
            ingredients: [
                ...formData.ingredients,
                { id: Date.now().toString(), name: "", quantity: "", unit: "" },
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
        field: keyof IngredientForm,
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
        setFormData({
            ...formData,
            steps: [
                ...formData.steps,
                { id: Date.now().toString(), order: newOrder, description: "" },
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
                <label className="section-label block mb-2">Título *</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                    }
                    className="input-field input-field--block text-lg font-semibold"
                    placeholder="Ej: Tortilla de patatas"
                />
            </div>

            <div className="py-5 border-b border-border">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                    <div>
                        <label className="section-label block mb-3">Categoría</label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => {
                                const meta = categoryMeta[category];
                                const selected = formData.category === category;
                                return (
                                    <button
                                        key={category}
                                        type="button"
                                        onClick={() =>
                                            setFormData({ ...formData, category })
                                        }
                                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors border ${
                                            selected
                                                ? "bg-accent/10 border-accent/50 text-accent-strong"
                                                : "bg-surface border-border text-text-muted hover:border-accent/40 hover:text-text"
                                        }`}
                                    >
                                        <span>{meta.emoji}</span>
                                        {meta.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex-1 pt-5 lg:pt-0">
                        <label className="section-label block mb-2">Descripción</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            className="input-field input-field--block resize-none"
                            rows={2}
                            placeholder="De dónde viene, qué la hace especial..."
                        />
                    </div>
                </div>
            </div>

            {!editing && (
                <>
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
                                                placeholder="Cantidad (ej: 500)"
                                            />
                                            <input
                                                type="text"
                                                value={ingredient.unit}
                                                onChange={(e) =>
                                                    updateIngredient(ingredient.id, "unit", e.target.value)
                                                }
                                                className="input-field input-field--block"
                                                placeholder="Unidad (ej: g)"
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

                    <div className="py-5 border-b border-border">
                        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                            <div>
                                <label className="section-label block mb-2">
                                    Valoración inicial (1-10)
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    max={10}
                                    value={formData.rating}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            rating: e.target.value ? Number(e.target.value) : undefined,
                                        })
                                    }
                                    className="input-field input-field--block"
                                />
                            </div>
                            <div className="pt-5 lg:pt-0">
                                <label className="section-label block mb-2">Notas</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) =>
                                        setFormData({ ...formData, notes: e.target.value })
                                    }
                                    className="input-field input-field--block resize-none"
                                    rows={2}
                                    placeholder="Notas de la primera versión"
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div className="py-5 flex gap-3 md:max-w-md">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-3 btn-outline"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="flex-1 py-3 btn-primary"
                >
                    {editing ? "Guardar" : "Crear receta"}
                </button>
            </div>
        </form>
    );
}