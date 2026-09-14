import { useState } from "react";
import type {
    IngredientForm,
    RecipeFormData,
    RecipeVersion,
    StepForm,
} from "../types/recipe";

interface NewVersionModalProps {
    isOpen: boolean;
    currentVersion: RecipeVersion;
    onClose: () => void;
    onSubmit: (summaryChanges: string, data: RecipeFormData) => void;
}

export default function NewVersionModal({
    isOpen,
    currentVersion,
    onClose,
    onSubmit,
}: NewVersionModalProps) {
    const [summaryChanges, setSummaryChanges] = useState("");
    const [formData, setFormData] = useState<RecipeFormData>({
        title: "",
        description: "",
        category: "MAIN_COURSE",
        ingredients: currentVersion.ingredients.map((ing) => ({
            id: ing.id,
            name: ing.name,
            quantity: String(ing.quantity),
            unit: ing.unit,
        })),
        steps: currentVersion.steps.map((step) => ({
            id: step.id,
            order: step.order,
            description: step.description,
        })),
        notes: currentVersion.notes || "",
        rating: currentVersion.rating || 5,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!summaryChanges.trim()) {
            alert("Debes indicar qué cambiate en esta versión");
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

        onSubmit(summaryChanges.trim(), {
            ...formData,
            ingredients: formData.ingredients.filter((ing) => ing.name.trim()),
            steps: formData.steps.filter((step) => step.description.trim()),
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

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                onClick={onClose}
            />

            <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4 pointer-events-none">
                <div className="card w-full md:max-w-2xl max-h-[90vh] rounded-t-2xl md:rounded-2xl border-b-0 md:border-b pointer-events-auto overflow-y-auto">
                    <div className="flex justify-center pt-3 pb-1 md:hidden">
                        <div className="w-10 h-1 bg-border rounded-full" />
                    </div>

                    <form onSubmit={handleSubmit} className="px-5 md:px-6 pb-6 pt-2 md:pt-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-serif font-semibold text-lg text-text">
                                Nueva versión
                            </h2>
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-2 text-text-muted hover:text-text active:text-text transition-colors"
                                aria-label="Cerrar"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-6">
                            <label className="section-label block mb-2">
                                ¿Qué cambiate en esta versión? *
                            </label>
                            <textarea
                                value={summaryChanges}
                                onChange={(e) => setSummaryChanges(e.target.value)}
                                className="input-field input-field--block resize-none"
                                rows={2}
                                placeholder="Ej: Añadí un poco más de sal, cambié el tiempo de horno..."
                            />
                        </div>

                        <div className="mb-6">
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

                        <div className="mb-6">
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

                        <div className="mb-6">
                            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                                <div>
                                    <label className="section-label block mb-2">
                                        Valoración (1-10)
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
                                        placeholder="Notas de esta versión"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 btn-outline"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-3 btn-primary"
                            >
                                Guardar versión
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
