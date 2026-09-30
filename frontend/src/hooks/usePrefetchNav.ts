import { useCallback, useEffect, useRef } from "react";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";
import { recipeQueries } from "../api/queries";

const HOVER_DELAY = 300;

const NAV_PREFETCH = {
    "/recipes": (client: QueryClient) => client.prefetchQuery(recipeQueries.list()),
    "/recetario": (client: QueryClient) =>
        client.prefetchQuery(recipeQueries.currentVersions()),
} as const;

export type NavPath = keyof typeof NAV_PREFETCH;

type PendingTimers = Partial<Record<NavPath, ReturnType<typeof setTimeout>>>;

export function usePrefetchNav() {
    const queryClient = useQueryClient();
    const timers = useRef<PendingTimers>({});

    const prefetch = useCallback(
        (path: NavPath) => {
            if (timers.current[path]) {
                return;
            }

            timers.current[path] = setTimeout(() => {
                delete timers.current[path];
                void NAV_PREFETCH[path](queryClient);
            }, HOVER_DELAY);
        },
        [queryClient]
    );

    const cancelPrefetch = useCallback((path: NavPath) => {
        const timer = timers.current[path];

        if (timer === undefined) {
            return;
        }

        clearTimeout(timer);
        delete timers.current[path];
    }, []);

    useEffect(() => {
        const pending = timers;

        return () => {
            Object.values(pending.current).forEach((timer) => clearTimeout(timer));
            pending.current = {};
        };
    }, []);

    return { prefetch, cancelPrefetch };
}
