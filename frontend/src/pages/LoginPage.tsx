import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
    const { login, isAuthenticated } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    if (isAuthenticated) {
        return <Navigate to="/recipes" replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await login(email, password);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Credenciales incorrectas"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-full flex flex-col items-center justify-center px-5 gradient-glow py-20 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-on-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            </div>
            <h1 className="font-serif font-semibold text-3xl tracking-tight mb-2">
                <span className="gradient-text">Iniciar sesión</span>
            </h1>
            <p className="text-sm text-on-surface-variant max-w-xs leading-relaxed mb-8">
                Accede a tu recetario personal.
            </p>

            <form
                onSubmit={handleSubmit}
                className="card p-6 w-full max-w-xs text-left space-y-4"
            >
                <div>
                    <label
                        htmlFor="email"
                        className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5"
                    >
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
                    <label
                        htmlFor="password"
                        className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5"
                    >
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
                    <p className="text-sm text-error bg-error-container/30 px-3 py-2 rounded-lg">
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
            </form>
        </div>
    );
}
