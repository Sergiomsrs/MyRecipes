import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useDemoLogin } from "../hooks/useDemoLogin";
import { getErrorMessage } from "../api/errors";

export default function LoginPage() {
    const { login, isAuthenticated } = useAuth();
    const { isDemoLoading, demoError, loginAsDemo } = useDemoLogin();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    if (isAuthenticated) {
        return <Navigate to="/recipes" replace />;
    }

    const loginWith = async (loginEmail: string, loginPassword: string) => {
        setError(null);
        setIsLoading(true);

        try {
            await login(loginEmail, loginPassword);
        } catch (err) {
            setError(
                getErrorMessage(err, "Credenciales incorrectas")
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await loginWith(email, password);
    };

    return (
        <div className="min-h-full flex flex-col items-center justify-center px-5 gradient-glow py-20 text-center">
            <h1 className="font-serif text-3xl tracking-tight mb-2">
                Iniciar sesión
            </h1>
            <p className="text-sm text-on-surface-variant max-w-xs leading-relaxed mb-8">
                Accede a tu recetario personal.
            </p>

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-xs text-left space-y-4"
            >
                <div>
                    <label htmlFor="email" className="section-label block mb-1.5">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field input-field--block"
                        placeholder="tu@email.com"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="section-label block mb-1.5">
                        Contraseña
                    </label>
                    <input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field input-field--block"
                        placeholder="••••••••"
                    />
                </div>

                {error && (
                    <p className="text-sm text-error border-l-2 border-error/50 pl-3">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full"
                >
                    {isLoading ? "Entrando..." : "Entrar"}
                </button>

                        <div className="flex items-center gap-3 pt-1">
                            <span className="h-px flex-1 bg-outline-variant/40" />
                            <span className="text-xs text-on-surface-variant">
                                o
                            </span>
                            <span className="h-px flex-1 bg-outline-variant/40" />
                        </div>

                        <button
                            type="button"
                            onClick={() => void loginAsDemo()}
                            disabled={isDemoLoading}
                            aria-busy={isDemoLoading}
                            className="btn-outline w-full"
                        >
                            {isDemoLoading
                                ? "Entrando…"
                                : "Probar con la cuenta demo"}
                        </button>

                        <p className="text-xs text-on-surface-variant text-center">
                            Sin registro. Los datos de la demo son compartidos.
                        </p>

                        {demoError && (
                            <p className="text-sm text-error border-l-2 border-error/50 pl-3">
                                {demoError}
                            </p>
                        )}
            </form>
        </div>
    );
}