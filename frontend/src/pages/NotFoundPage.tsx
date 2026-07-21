import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div className="min-h-full flex flex-col items-center justify-center px-5 text-center gradient-glow py-20">
            <p className="text-6xl font-bold gradient-text mb-4">404</p>
            <h1 className="text-xl font-semibold text-text mb-2">Página no encontrada</h1>
            <p className="text-sm text-text-muted mb-8">
                Esta ruta no existe en tu cuaderno.
            </p>
            <Link
                to="/"
                className="text-accent font-medium active:opacity-80 transition-opacity"
            >
                Volver al inicio
            </Link>
        </div>
    );
}
