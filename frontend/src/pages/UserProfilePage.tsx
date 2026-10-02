import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useRecipes";
import { changePassword } from "../api/users";
import { getErrorMessage } from "../api/errors";

export default function UserProfilePage() {
    const { user, logout } = useAuth();
    const {
        data: profile,
        isPending,
        error,
    } = useProfile();

    const isDemo = user?.role === "DEMO";

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const profileError = error
        ? getErrorMessage(error, "Error al cargar el perfil")
        : null;

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(null);

        if (newPassword !== confirmPassword) {
            setPasswordError("Las contraseñas nuevas no coinciden");
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError(
                "La nueva contraseña debe tener al menos 6 caracteres"
            );
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await changePassword(
                currentPassword,
                newPassword
            );
            setPasswordSuccess(result.message);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setPasswordError(
                getErrorMessage(err, "Error al cambiar la contraseña")
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isPending) {
        return (
            <div className="min-h-full flex items-center justify-center">
                <div className="text-on-surface-variant text-sm">
                    Cargando perfil...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full flex flex-col items-center px-5 py-12 text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-xl font-semibold text-primary">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                </span>
            </div>
            <h1 className="font-serif text-2xl tracking-tight mb-1">
                Mi cuenta
            </h1>
            <p className="text-sm text-on-surface-variant mb-8">
                {user?.email}
            </p>

            <div className="w-full max-w-sm space-y-8 text-left">
                {profileError && (
                    <p className="text-sm text-error border-l-2 border-error/50 pl-3">
                        {profileError}
                    </p>
                )}

                {/* Datos del usuario */}
                <div>
                    <h2 className="section-label mb-4">Datos</h2>
                    <dl className="space-y-3">
                        <div>
                            <dt className="text-xs text-on-surface-variant mb-0.5">
                                Email
                            </dt>
                            <dd className="text-sm text-on-surface break-all">
                                {profile?.email ?? user?.email}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-on-surface-variant mb-0.5">
                                Rol
                            </dt>
                            <dd className="text-sm text-on-surface">
                                {profile?.role ?? user?.role}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-on-surface-variant mb-0.5">
                                ID de usuario
                            </dt>
                            <dd className="text-xs text-on-surface-variant break-all">
                                {profile?.userId ?? user?.userId}
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* Cambiar contraseña */}
                {isDemo ? (
                    <div>
                        <h2 className="section-label mb-4">
                            Cambiar contraseña
                        </h2>
                        <p className="text-sm text-on-surface-variant border-l-2 border-outline-variant/50 pl-3">
                            No disponible en la cuenta demo.
                        </p>
                    </div>
                ) : (
                    <div>
                        <h2 className="section-label mb-4">Cambiar contraseña</h2>
                        <form
                            onSubmit={handlePasswordChange}
                            className="space-y-4"
                        >
                            <div>
                                <label
                                    htmlFor="currentPassword"
                                    className="section-label block mb-1.5"
                                >
                                    Contraseña actual
                                </label>
                                <input
                                    id="currentPassword"
                                    type="password"
                                    required
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="input-field input-field--block"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="newPassword"
                                    className="section-label block mb-1.5"
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
                                    className="input-field input-field--block"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="section-label block mb-1.5"
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
                                    className="input-field input-field--block"
                                />
                            </div>

                            {passwordError && (
                                <p className="text-sm text-error border-l-2 border-error/50 pl-3">
                                    {passwordError}
                                </p>
                            )}
                            {passwordSuccess && (
                                <p className="text-sm text-on-surface-variant border-l-2 border-secondary/50 pl-3">
                                    {passwordSuccess}
                                </p>
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
                )}

                {/* Cerrar sesión */}
                <div className="pt-8 border-t border-outline-variant/40">
                    <button
                        type="button"
                        onClick={logout}
                        className="w-full py-3 btn-outline text-error border-error/30 hover:bg-error/5"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </div>
    );
}
