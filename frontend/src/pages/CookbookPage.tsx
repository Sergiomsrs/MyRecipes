import { useCookbook } from "../hooks/useRecipes";
import { getErrorMessage } from "../api/errors";
import RecipeCard from "../components/RecipeCard";

export default function CookbookPage() {
    const { data: entries, isPending, error, refetch } = useCookbook();

    if (error) {
        return (
            <div className="min-h-full bg-surface">
                <div className="page-container pt-16 flex flex-col items-center justify-center text-center">
                    <p className="font-serif text-lg text-on-surface mb-2">
                        No se pudo cargar el recetario
                    </p>
                    <p className="text-sm text-error border-l-2 border-error/50 pl-3 mb-6">
                        {getErrorMessage(error, "No se pudo cargar el recetario")}
                    </p>
                    <button
                        type="button"
                        onClick={() => void refetch()}
                        className="px-5 py-2.5 btn-primary"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    if (isPending || !entries) {
        return (
            <div className="min-h-full bg-surface flex items-center justify-center py-24">
                <p className="text-on-surface-variant">Cargando el recetario...</p>
            </div>
        );
    }

    if (entries.length === 0) {
        return (
            <div className="min-h-full bg-surface">
                <div className="page-container pt-10 pb-24 md:pb-8">
                    <h1 className="font-serif text-2xl text-on-surface">
                        Tu recetario
                    </h1>
                    <p className="text-sm text-on-surface-variant mt-0.5 mb-8">
                        Aún no hay nada que cocinar.
                    </p>
                    <p className="text-sm text-on-surface-variant max-w-md">
                        Cuando crees una receta, aquí aparecerá su versión final
                        lista para consultar y cocinar.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-surface">
            <div className="page-container pt-6 pb-24 md:pb-8">
                <header className="mb-8">
                    <h1 className="font-serif text-2xl text-on-surface">
                        Tu recetario
                    </h1>
                    <p className="text-sm text-on-surface-variant mt-0.5">
                        {entries.length === 1
                            ? "1 versión final · lista para cocinar"
                            : `${entries.length} versiones finales · listas para cocinar`}
                    </p>
                </header>

                <div className="cookbook-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start">
                    {entries.map((entry) => (
                        <RecipeCard
                            key={entry.recipe.id}
                            recipe={entry.recipe}
                            version={entry.currentVersion}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}