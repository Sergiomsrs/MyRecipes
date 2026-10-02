import { useCallback, useState } from "react";
import axios from "axios";
import { useAuth } from "./useAuth";

// Credenciales de la cuenta demo pública: van escritas en el código a propósito,
// cualquiera que abra la aplicación puede entrar con ellas.
const DEMO_EMAIL = "demo-user@myrecipes.es";
const DEMO_PASSWORD = "password123";

const RATE_LIMIT_MESSAGE =
    "Demasiados intentos. Prueba de nuevo en unos minutos.";
const GENERIC_MESSAGE = "No se ha podido entrar a la demo. Inténtalo más tarde.";

function getDemoErrorMessage(err: unknown): string {
    if (axios.isAxiosError(err) && err.response?.status === 429) {
        return RATE_LIMIT_MESSAGE;
    }

    return GENERIC_MESSAGE;
}

export function useDemoLogin() {
    const { login } = useAuth();
    const [isDemoLoading, setIsDemoLoading] = useState(false);
    const [demoError, setDemoError] = useState<string | null>(null);

    const loginAsDemo = useCallback(async () => {
        if (isDemoLoading) {
            return false;
        }

        setDemoError(null);
        setIsDemoLoading(true);

        try {
            await login(DEMO_EMAIL, DEMO_PASSWORD);
            return true;
        } catch (err) {
            setDemoError(getDemoErrorMessage(err));
            return false;
        } finally {
            setIsDemoLoading(false);
        }
    }, [login, isDemoLoading]);

    return {
        isDemoLoading,
        demoError,
        loginAsDemo,
    };
}