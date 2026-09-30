import axios from "axios";

interface ApiErrorBody {
    message?: string;
}

const OFFLINE_MESSAGE =
    "Sin conexión con el servidor. Revisa tu conexión e inténtalo de nuevo.";

export function getErrorMessage(err: unknown, fallback: string): string {
    if (axios.isAxiosError(err)) {
        const serverMessage = (err.response?.data as ApiErrorBody | undefined)
            ?.message;
        if (serverMessage) {
            return serverMessage;
        }

        const status = err.response?.status;

        if (status === undefined) {
            return OFFLINE_MESSAGE;
        }
        if (status === 401) {
            return "Tu sesión ha expirado. Vuelve a iniciar sesión.";
        }
        if (status === 403) {
            return "No tienes permiso para realizar esta acción.";
        }
        if (status >= 500) {
            return "El servidor está teniendo problemas. Inténtalo de nuevo más tarde.";
        }
    }

    return err instanceof Error ? err.message : fallback;
}
