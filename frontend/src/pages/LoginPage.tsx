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
            <span className="chip mb-6">
                <span className="text-base leading-none">🥘</span>
                Cuaderno
            </span>
            <h1 className="font-serif font-semibold text-3xl tracking-tight mb-2">
                <span className="gradient-text">Iniciar sesión</span>
            </h1>
            <p className="text-sm text-text-muted max-w-xs leading-relaxed mb-8">
                Accede a tu recetario personal.
            </p>

            <form onSubmit={handleSubmit} className="card p-6 w-full max-w-xs text-left space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-surface-raised border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                        placeholder="tu@email.com"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-text mb-1">
                        Contraseña
                    </label>
                    <input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-surface-raised border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                        placeholder="••••••••"
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-500">{error}</p>
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
