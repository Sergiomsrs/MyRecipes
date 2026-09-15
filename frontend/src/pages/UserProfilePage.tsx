import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import * as usersApi from "../api/users";

export default function UserProfilePage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<usersApi.UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        usersApi
            .getProfile()
            .then(setProfile)
            .catch((err) => {
                setError(err instanceof Error ? err.message : "Error al cargar el perfil");
            })
            .finally(() => setIsLoading(false));
    }, []);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(null);

        if (newPassword !== confirmPassword) {
            setPasswordError("Las contraseñas nuevas no coinciden");
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError("La nueva contraseña debe tener al menos 6 caracteres");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await usersApi.changePassword(currentPassword, newPassword);
            setPasswordSuccess(result.message);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setPasswordError(
                err instanceof Error ? err.message : "Error al cambiar la contraseña"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-full flex items-center justify-center">
                <div className="text-text-muted text-sm">Cargando perfil...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-full flex items-center justify-center">
                <div className="text-red-500 text-sm">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-full flex flex-col items-center px-5 py-12 text-center">
            <span className="chip mb-6">
                <span className="text-base leading-none">👤</span>
                Mi cuenta
            </span>
            <h1 className="font-serif font-semibold text-3xl tracking-tight mb-8">
                <span className="gradient-text">Perfil de usuario</span>
            </h1>

            <div className="w-full max-w-sm space-y-6 text-left">
                {/* Datos del usuario */}
                <div className="card p-6">
                    <h2 className="font-serif font-semibold text-lg text-text mb-4">
                        Datos
                    </h2>
                    <dl className="space-y-3">
                        <div>
                            <dt className="text-xs text-text-muted uppercase tracking-wide mb-0.5">
                                Email
                            </dt>
                            <dd className="text-sm text-text font-medium">
                                {profile?.email ?? user?.email}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-text-muted uppercase tracking-wide mb-0.5">
                                Rol
                            </dt>
                            <dd className="text-sm text-text font-medium">
                                {profile?.role ?? user?.role}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-text-muted uppercase tracking-wide mb-0.5">
                                ID de usuario
                            </dt>
                            <dd className="text-xs text-text-muted font-mono break-all">
                                {profile?.userId ?? user?.userId}
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* Cambiar contraseña */}
                <div className="card p-6">
                    <h2 className="font-serif font-semibold text-lg text-text mb-4">
                        Cambiar contraseña
                    </h2>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label
                                htmlFor="currentPassword"
                                className="block text-sm font-medium text-text mb-1"
                            >
                                Contraseña actual
                            </label>
                            <input
                                id="currentPassword"
                                type="password"
                                required
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-surface-raised border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="newPassword"
                                className="block text-sm font-medium text-text mb-1"
                            >
                                Nueva contraseña
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                required
                                minLength={6}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-surface-raised border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-text mb-1"
                            >
                                Confirmar nueva contraseña
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                required
                                minLength={6}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-surface-raised border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                            />
                        </div>

                        {passwordError && (
                            <p className="text-sm text-red-500">{passwordError}</p>
                        )}
                        {passwordSuccess && (
                            <p className="text-sm text-green-500">{passwordSuccess}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary w-full"
                        >
                            {isSubmitting ? "Guardando..." : "Actualizar contraseña"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
