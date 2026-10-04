import type { Recipe, RecipeVersion } from "../types/recipe";
import { categoryMeta } from "../constants/categories";

interface RecipeShareCardProps {
    recipe: Recipe;
    version?: RecipeVersion | null;
}

export default function RecipeShareCard({ recipe, version }: RecipeShareCardProps) {
    const meta = categoryMeta[recipe.category];
    const ingredients = version
        ? [...version.ingredients].sort((a, b) => a.orderIndex - b.orderIndex)
        : [];
    const steps = version
        ? [...version.steps].sort((a, b) => a.order - b.order)
        : [];
    const heroPhoto = version?.photos?.[0];

    return (
        <article className="recipe-share-card">
            <div className="recipe-share-card__media">
                {heroPhoto ? (
                    <img src={heroPhoto.url} alt={heroPhoto.caption || recipe.title} />
                ) : (
                    <div className="recipe-share-card__placeholder" aria-label="Sin fotografía">
                        <span>{meta.emoji}</span>
                        <p>{recipe.title}</p>
                    </div>
                )}
            </div>

            <div className="recipe-share-card__content">
                <header className="recipe-share-card__header">
                    <p className="section-label">
                        {meta.emoji} {meta.label}
                    </p>
                    {version && (
                        <span className="recipe-share-card__version">
                            v{version.versionNumber}
                        </span>
                    )}
                </header>

                <h2>{recipe.title}</h2>

                <div className="recipe-share-card__meta">
                    <span>{recipe.description || "Receta casera"}</span>
                    {version?.rating ? (
                        <span>Valoración {version.rating}/10</span>
                    ) : (
                        <span>Recetario MyRecipes</span>
                    )}
                </div>

                <div className="recipe-share-card__body">
                    {ingredients.length > 0 && (
                        <section>
                            <p className="section-label">Ingredientes</p>
                            <ul>
                                {ingredients.map((ingredient) => (
                                    <li key={ingredient.id}>
                                        <span>{ingredient.name}</span>
                                        <em>
                                            {ingredient.quantity} {ingredient.unit}
                                        </em>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {steps.length > 0 && (
                        <section>
                            <p className="section-label">Preparación</p>
                            <ol>
                                {steps.map((step, index) => (
                                    <li key={step.id}>
                                        <span>{String(index + 1).padStart(2, "0")}</span>
                                        <p>{step.description}</p>
                                    </li>
                                ))}
                            </ol>
                        </section>
                    )}
                </div>

                <footer className="recipe-share-card__footer">
                    MyRecipes · Sergio Méndez
                </footer>
            </div>
        </article>
    );
}
