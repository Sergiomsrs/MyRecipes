import { useCallback, useEffect, useRef, useState } from "react";
import * as api from "../api/recipes";
import { getErrorMessage } from "../api/errors";
import type { RecipeWithCurrentVersion } from "../types/recipe";

export function useCookbook() {
    const [entries, setEntries] = useState<RecipeWithCurrentVersion[] | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const controllerRef = useRef<AbortController | null>(null);

    const loadCookbook = useCallback(() => {
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        setIsLoading(true);
        setError(null);

        api.getRecipesWithCurrentVersion(controller.signal)
            .then((data) => {
                if (controller.signal.aborted) return;
                setEntries(data);
                setIsLoading(false);
            })
            .catch((err: unknown) => {
                if (controller.signal.aborted) return;
                setError(getErrorMessage(err, "Error al cargar el recetario"));
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        loadCookbook();

        return () => {
            controllerRef.current?.abort();
        };
    }, [loadCookbook]);

    return { entries, isLoading, error, reload: loadCookbook };
}
