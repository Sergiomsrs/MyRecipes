export interface Ingredient {
    id: string;
    name: string;
    quantity: string;
    unit: string;
}

export interface Step {
    id: string;
    order: number;
    description: string;
}

export interface Attempt {
    id: string;
    date: string;
    rating?: number;
    notes?: string;
}

export interface Recipe {
    id: string;
    name: string;
    description?: string;
    ingredients: Ingredient[];
    steps: Step[];
    attempts: Attempt[];
    createdAt: string;
    updatedAt: string;
}

export interface RecipeFormData {
    name: string;
    description: string;
    ingredients: Ingredient[];
    steps: Step[];
}
