import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

const MINUTE = 60_000;

function shouldRetry(failureCount: number, error: Error): boolean {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;

    if (status !== undefined && status < 500) {
        return false;
    }

    return failureCount < 1;
}

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: MINUTE,
            gcTime: 30 * MINUTE,
            retry: shouldRetry,
        },
    },
});
