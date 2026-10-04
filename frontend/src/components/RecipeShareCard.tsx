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
        <article
            className={`recipe-share-card${heroPhoto ? "" : " recipe-share-card--without-photo"}`}
        >
            {heroPhoto ? (
                <div className="recipe-share-card__media">
                    <img src={heroPhoto.url} alt={heroPhoto.caption || recipe.title} />
                    <div className="recipe-share-card__media-caption">
                        <span>{meta.label}</span>
                        {version && <span>Versión {version.versionNumber}</span>}
                    </div>
                </div>
            ) : (
                <div className="recipe-share-card__cover">
                    <p className="recipe-share-card__brand">MyRecipes <span>·</span> Recetario personal</p>
                    <p className="recipe-share-card__category">{meta.label}</p>
                    <h2>{recipe.title}</h2>
                </div>
            )}

            <div className="recipe-share-card__content">
                {heroPhoto && (
                    <header className="recipe-share-card__title-block">
                        <h2>{recipe.title}</h2>
                        {recipe.description && <p>{recipe.description}</p>}
                    </header>
                )}
                {!heroPhoto && recipe.description && (
                    <p className="recipe-share-card__description">
                        {recipe.description}
                    </p>
                )}

                <div className="recipe-share-card__meta">
                    {version && (
                        <span>
                            <small>Versión</small>
                            <strong>{version.versionNumber}</strong>
                        </span>
                    )}
                    {version?.rating && (
                        <span>
                            <small>Valoración</small>
                            <strong>{version.rating}/10</strong>
                        </span>
                    )}
                    {!version && (
                        <span>
                            <small>Receta</small>
                            <strong>De casa</strong>
                        </span>
                    )}
                </div>

                <div className="recipe-share-card__body">
                    {ingredients.length > 0 && (
                        <section className="recipe-share-card__section recipe-share-card__section--ingredients">
                            <h3><span>01</span> Ingredientes</h3>
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
                        <section className="recipe-share-card__section recipe-share-card__section--steps">
                            <h3><span>02</span> Preparación</h3>
                            <ol>
                                {steps.map((step, index) => (
                                    <li key={step.id}>
                                        <span>
                                            <span>{String(index + 1).padStart(2, "0")}</span>
                                        </span>
                                        <p>{step.description}</p>
                                    </li>
                                ))}
                            </ol>
                        </section>
                    )}
                </div>

                <footer className="recipe-share-card__footer">
                    <span className="recipe-share-card__footer-mark" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path
                                d="M5 18V6l7 8 7-8v12"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                    <span>MyRecipes</span>
                    <i aria-hidden="true" />
                    <span>Sergio Méndez</span>
                </footer>
            </div>
        </article>
    );
}
