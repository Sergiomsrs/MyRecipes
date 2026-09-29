import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div className="min-h-full flex flex-col items-center justify-center px-5 text-center gradient-glow py-20">
            <p className="font-serif text-6xl text-primary mb-4">
                404
            </p>
            <h1 className="font-serif text-xl text-on-surface mb-2">
                Página no encontrada
            </h1>
            <p className="text-sm text-on-surface-variant mb-8">
                Esta ruta no existe en tu cuaderno.
            </p>
            <Link to="/" className="btn-primary max-w-xs">
                Volver al inicio
            </Link>
        </div>
    );
}
