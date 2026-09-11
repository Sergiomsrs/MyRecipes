export type RecipeCategory =
    | "STARTER"
    | "MAIN_COURSE"
    | "DESSERT"
    | "DRINK"
    | "SAUCE"
    | "OTHER";

export interface Recipe {
    id: string;
    userId: string;
    title: string;
    description?: string;
    category: RecipeCategory;
    currentVersionId: string;
    createdAt: string;
    updatedAt: string;
}

export interface IngredientForm {
    id: string;
    name: string;
    quantity: string;
    unit: string;
}

export interface StepForm {
    id: string;
    order: number;
    description: string;
}

export interface RecipeFormData {
    title: string;
    description: string;
    category: RecipeCategory;
    ingredients: IngredientForm[];
    steps: StepForm[];
    notes?: string;
    rating?: number;
}

export interface Attempt {
    id: string;
    date: string;
    rating?: number;
    notes?: string;
}

export interface CreateIngredientPayload {
    name: string;
    quantity: number;
    unit: string;
    orderIndex: number;
}

export interface CreateStepPayload {
    order: number;
    description: string;
}

export interface CreatePhotoPayload {
    url: string;
    caption?: string;
}

export interface CreateRecipePayload {
    userId: string;
    title: string;
    description: string;
    category: RecipeCategory;
    summaryChanges?: string;
    notes?: string;
    rating?: number;
    ingredients: CreateIngredientPayload[];
    steps: CreateStepPayload[];
    photos?: CreatePhotoPayload[];
}

export interface UpdateRecipePayload {
    userId: string;
    title: string;
    description: string;
    category: RecipeCategory;
}