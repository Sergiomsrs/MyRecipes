import type { Recipe, RecipeVersion } from "../types/recipe";
import { categoryMeta } from "../constants/categories";

interface RecipeBookPageProps {
    recipe: Recipe;
    version?: RecipeVersion | null;
    onShare?: (recipe: Recipe, version?: RecipeVersion | null) => void;
}

export default function RecipeBookPage({
    recipe,
    version,
    onShare,
}: RecipeBookPageProps) {
    const meta = categoryMeta[recipe.category];
    const ingredients = version
        ? [...version.ingredients].sort((a, b) => a.orderIndex - b.orderIndex)
        : [];
    const steps = version
        ? [...version.steps].sort((a, b) => a.order - b.order)
        : [];
    const heroPhoto = version?.photos?.[0];

    const summaryItems = [
        { label: "Versión", value: version ? `v${version.versionNumber}` : "actual" },
        { label: "Categoría", value: meta.label },
        ...(version?.rating ? [{ label: "Valoración", value: `${version.rating}/10` }] : []),
    ];

    return (
        <article
            className={`recipe-book-page${heroPhoto ? "" : " recipe-book-page--without-photo"}`}
        >
            <header className="recipe-book-header-row">
                <div>
                    <p className="section-label">
                        {meta.emoji} {meta.label}
                    </p>
                </div>

                {onShare && (
                    <button
                        type="button"
                        className="recipe-book-share-button"
                        aria-label={`Compartir ${recipe.title}`}
                        onClick={() => onShare(recipe, version)}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <circle cx="18" cy="5" r="2.5" />
                            <circle cx="6" cy="12" r="2.5" />
                            <circle cx="18" cy="19" r="2.5" />
                            <path d="M8.5 11.2l7.3-4.2M8.5 12.8l7.3 4.2" />
                        </svg>
                    </button>
                )}
            </header>

            <div className="recipe-book-title-block">
                <h2 className="font-serif recipe-book-title">{recipe.title}</h2>
                {recipe.description && (
                    <p className="recipe-book-description">{recipe.description}</p>
                )}
            </div>

            <div className="recipe-book-summary-row" aria-label="Información de la receta">
                {summaryItems.map(({ label, value }) => (
                    <div key={label} className="recipe-book-summary-item">
                        <span>{label}</span>
                        <strong>{value}</strong>
                    </div>
                ))}
            </div>

            {heroPhoto && (
                <div className="recipe-book-photo-wrapper">
                    <img
                        src={heroPhoto.url}
                        alt={heroPhoto.caption || recipe.title}
                        className="recipe-book-photo"
                    />
                </div>
            )}

            <div className="recipe-book-content-grid">
                <section className="recipe-book-sections">
                    <p className="section-label">Ingredientes</p>
                    {ingredients.length > 0 ? (
                        <ul className="recipe-book-ingredients">
                            {ingredients.map((ingredient) => (
                                <li key={ingredient.id}>
                                    <span>{ingredient.name}</span>
                                    <em>
                                        {ingredient.quantity} {ingredient.unit}
                                    </em>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="recipe-book-empty-copy">
                            Añade ingredientes para completar la receta.
                        </p>
                    )}
                </section>

                <section className="recipe-book-sections">
                    <p className="section-label">Preparación</p>
                    {steps.length > 0 ? (
                        <ol className="recipe-book-steps">
                            {steps.map((step, index) => (
                                <li key={step.id}>
                                    <span>{String(index + 1).padStart(2, "0")}</span>
                                    <p>{step.description}</p>
                                </li>
                            ))}
                        </ol>
                    ) : (
                        <p className="recipe-book-empty-copy">
                            Los pasos de la preparación aparecerán aquí.
                        </p>
                    )}
                </section>
            </div>

            {version?.notes && (
                <aside className="recipe-book-notes">
                    <p className="section-label">Notas</p>
                    <p>{version.notes}</p>
                </aside>
            )}

            <footer className="recipe-book-footer">MyRecipes · Sergio Méndez</footer>
        </article>
    );
}
