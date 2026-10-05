import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useCookbook } from "../hooks/useRecipes";
import { getErrorMessage } from "../api/errors";
import RecipeBookPage from "../components/RecipeBookPage";
import RecipeShareCard from "../components/RecipeShareCard";
import html2canvas from "html2canvas";
import type { Recipe, RecipeVersion } from "../types/recipe";

export default function CookbookPage() {
    const { data: entries, isPending, error, refetch } = useCookbook();
    const [shareTarget, setShareTarget] = useState<{
        recipe: Recipe;
        version?: RecipeVersion | null;
    } | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isExporting, setIsExporting] = useState(false);
    const [shareMessage, setShareMessage] = useState("");
    const [shareError, setShareError] = useState("");
    const shareRef = useRef<HTMLDivElement>(null);
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);
    const shareCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(
        () => () => {
            if (shareCloseTimerRef.current) {
                clearTimeout(shareCloseTimerRef.current);
            }
        },
        []
    );

    useEffect(() => {
        if (!shareTarget) return;

        const scrollY = window.scrollY;
        const body = document.body;
        const previousStyles = {
            position: body.style.position,
            top: body.style.top,
            left: body.style.left,
            right: body.style.right,
            width: body.style.width,
            overflow: body.style.overflow,
            paddingRight: body.style.paddingRight,
        };
        const scrollbarWidth =
            window.innerWidth - document.documentElement.clientWidth;

        body.style.position = "fixed";
        body.style.top = `-${scrollY}px`;
        body.style.left = "0";
        body.style.right = "0";
        body.style.width = "100%";
        body.style.overflow = "hidden";
        if (scrollbarWidth > 0) {
            body.style.paddingRight = `${scrollbarWidth}px`;
        }

        return () => {
            body.style.position = previousStyles.position;
            body.style.top = previousStyles.top;
            body.style.left = previousStyles.left;
            body.style.right = previousStyles.right;
            body.style.width = previousStyles.width;
            body.style.overflow = previousStyles.overflow;
            body.style.paddingRight = previousStyles.paddingRight;
            window.scrollTo(0, scrollY);
        };
    }, [shareTarget]);

    useEffect(() => {
        if (!entries || entries.length === 0) {
            setCurrentIndex(0);
            return;
        }

        setCurrentIndex((prev) => Math.min(prev, entries.length - 1));
    }, [entries]);

    useEffect(() => {
        if (!entries || entries.length <= 1) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            const isFormElement =
                target &&
                ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);

            if (isFormElement) {
                return;
            }

            if (event.key === "ArrowLeft") {
                event.preventDefault();
                setCurrentIndex((prev) =>
                    prev === 0 ? entries.length - 1 : prev - 1
                );
            }

            if (event.key === "ArrowRight") {
                event.preventDefault();
                setCurrentIndex((prev) =>
                    prev === entries.length - 1 ? 0 : prev + 1
                );
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [entries]);

    const handleShare = (recipe: Recipe, version?: RecipeVersion | null) => {
        if (shareCloseTimerRef.current) {
            clearTimeout(shareCloseTimerRef.current);
            shareCloseTimerRef.current = null;
        }
        setShareTarget({ recipe, version });
        setShareMessage("");
        setShareError("");
    };

    const closeShareDialog = () => {
        if (isExporting) return;
        if (shareCloseTimerRef.current) {
            clearTimeout(shareCloseTimerRef.current);
            shareCloseTimerRef.current = null;
        }
        setShareTarget(null);
        setShareMessage("");
        setShareError("");
    };

    const closeShareDialogAfterSuccess = () => {
        shareCloseTimerRef.current = setTimeout(() => {
            setShareTarget(null);
            setShareMessage("");
            shareCloseTimerRef.current = null;
        }, 1500);
    };

    const exportRecipeImage = async (action: "copy" | "download") => {
        if (!shareTarget || isExporting) return;

        const { recipe } = shareTarget;
        setIsExporting(true);
        setShareMessage("");
        setShareError("");

        await new Promise((resolve) => {
            requestAnimationFrame(() => {
                requestAnimationFrame(resolve);
            });
        });

        const node = shareRef.current;
        if (!node) {
            setShareError("No se pudo preparar la imagen de la receta.");
            setIsExporting(false);
            return;
        }

        try {
            const canvas = await html2canvas(node, {
                scale: 2,
                useCORS: true,
                backgroundColor: null,
            });

            const blob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob((result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(new Error("No se pudo crear el archivo PNG."));
                    }
                }, "image/png");
            });

            if (action === "copy") {
                if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
                    throw new Error(
                        "Este navegador no permite copiar imágenes al portapapeles. Puedes descargarla."
                    );
                }

                await navigator.clipboard.write([
                    new ClipboardItem({ "image/png": blob }),
                ]);
                setShareMessage("Imagen copiada al portapapeles.");
                closeShareDialogAfterSuccess();
            } else {
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                const safeTitle = recipe.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "");
                link.href = url;
                link.download = `receta-${safeTitle || recipe.id}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.setTimeout(() => URL.revokeObjectURL(url), 1000);
                setShareMessage("Descarga de la imagen iniciada.");
                closeShareDialogAfterSuccess();
            }
        } catch (error) {
            setShareError(
                error instanceof Error
                    ? error.message
                    : "No se pudo exportar la imagen de la receta."
            );
        } finally {
            setIsExporting(false);
        }
    };

    const goToPrevious = () => {
        if (!entries || entries.length === 0) return;
        setCurrentIndex((prev) =>
            prev === 0 ? entries.length - 1 : prev - 1
        );
    };

    const goToNext = () => {
        if (!entries || entries.length === 0) return;
        setCurrentIndex((prev) =>
            prev === entries.length - 1 ? 0 : prev + 1
        );
    };

    const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        if (event.touches.length !== 1) {
            touchStartRef.current = null;
            return;
        }

        const touch = event.touches[0];
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
        const start = touchStartRef.current;
        touchStartRef.current = null;
        if (!start || event.changedTouches.length !== 1) return;

        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - start.x;
        const deltaY = touch.clientY - start.y;
        if (Math.abs(deltaX) < 50 || Math.abs(deltaX) <= Math.abs(deltaY)) return;

        if (deltaX > 0) {
            goToPrevious();
        } else {
            goToNext();
        }
    };

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

    const currentEntry = entries[currentIndex];

    return (
        <div className="min-h-full bg-surface">
            <div className="page-container pt-6 pb-24 md:pb-8">
                <header className="recipe-book-hero">
                    <p className="section-label">Mi recetario</p>
                    <h1 className="font-serif text-3xl md:text-4xl text-on-surface">
                        MyRecipes
                    </h1>
                </header>

                <div className="recipe-book-shell">
                    <label className="recipe-book-mobile-index">
                        <span>Ir directamente a</span>
                        <select
                            value={currentIndex}
                            onChange={(event) => setCurrentIndex(Number(event.target.value))}
                            aria-label="Seleccionar receta del recetario"
                        >
                            {entries.map((entry, index) => (
                                <option key={entry.recipe.id} value={index}>
                                    {String(index + 1).padStart(2, "0")} · {entry.recipe.title}
                                </option>
                            ))}
                        </select>
                    </label>

                    <aside className="recipe-book-index" aria-label="Índice de recetas">
                        <p className="section-label">Índice</p>
                        <ol>
                            {entries.map((entry, index) => (
                                <li key={entry.recipe.id}>
                                    <button
                                        type="button"
                                        className="recipe-book-index-button"
                                        aria-current={index === currentIndex ? "page" : undefined}
                                        onClick={() => setCurrentIndex(index)}
                                    >
                                        <span>{String(index + 1).padStart(2, "0")}</span>
                                        <span>{entry.recipe.title}</span>
                                    </button>
                                </li>
                            ))}
                        </ol>
                    </aside>

                    <div className="recipe-book-main">
                        <div
                            className="recipe-book-page-frame"
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                            onTouchCancel={() => {
                                touchStartRef.current = null;
                            }}
                        >
                            <RecipeBookPage
                                recipe={currentEntry.recipe}
                                version={currentEntry.currentVersion}
                                onShare={handleShare}
                            />
                        </div>

                        <nav
                            className="recipe-book-navigation"
                            aria-label="Navegación del recetario"
                        >
                            <button
                                type="button"
                                className="recipe-book-nav-button"
                                onClick={goToPrevious}
                                aria-label="Receta anterior"
                            >
                                ‹ Anterior
                            </button>

                            <div className="recipe-book-indicator" aria-live="polite">
                                {currentIndex + 1} / {entries.length}
                            </div>

                            <button
                                type="button"
                                className="recipe-book-nav-button"
                                onClick={goToNext}
                                aria-label="Receta siguiente"
                            >
                                Siguiente ›
                            </button>
                        </nav>
                    </div>
                </div>
            </div>

            {shareTarget &&
                createPortal(
                    <>
                        <button
                            type="button"
                            className="fixed inset-0 z-[60] bg-on-surface/40"
                            aria-label="Cerrar opciones para compartir"
                            onClick={closeShareDialog}
                            disabled={isExporting}
                        />
                        <div className="fixed inset-0 z-[61] flex items-center justify-center p-3">
                            <section
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="recipe-share-dialog-title"
                                className="plane w-full max-w-md max-h-[calc(100dvh-1.5rem)] overflow-y-auto overscroll-contain rounded-xl p-5 shadow-xl"
                            >
                                <div className="mb-5 flex items-start justify-between gap-4">
                                    <div>
                                        <h2
                                            id="recipe-share-dialog-title"
                                            className="font-serif text-xl text-on-surface"
                                        >
                                            Compartir receta
                                        </h2>
                                        <p className="mt-1 text-sm text-on-surface-variant">
                                            {shareTarget.recipe.title}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={closeShareDialog}
                                        disabled={isExporting}
                                        className="rounded-md p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface disabled:opacity-50"
                                        aria-label="Cerrar"
                                    >
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
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

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <button
                                        type="button"
                                        className="btn-primary"
                                        onClick={() => void exportRecipeImage("copy")}
                                        disabled={isExporting}
                                    >
                                        Copiar imagen
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-outline"
                                        onClick={() => void exportRecipeImage("download")}
                                        disabled={isExporting}
                                    >
                                        Descargar PNG
                                    </button>
                                </div>

                                {isExporting && (
                                    <p className="mt-4 text-sm text-on-surface-variant" role="status">
                                        Preparando la imagen...
                                    </p>
                                )}
                                {shareMessage && (
                                    <p className="mt-4 text-sm text-secondary" role="status">
                                        {shareMessage}
                                    </p>
                                )}
                                {shareError && (
                                    <p className="mt-4 text-sm text-error" role="alert">
                                        {shareError}
                                    </p>
                                )}
                            </section>
                        </div>
                    </>,
                    document.body
                )}

            <div
                aria-hidden="true"
                className="fixed -left-[9999px] top-0 pointer-events-none"
                ref={shareRef}
            >
                {shareTarget && (
                    <RecipeShareCard
                        recipe={shareTarget.recipe}
                        version={shareTarget.version}
                    />
                )}
            </div>
        </div>
    );
}