import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-linear-to-b from-blue-50 to-white flex flex-col items-center justify-center px-4 py-8">
            <div className="text-center max-w-md">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">AppRecetas</h1>

                <p className="text-xl text-gray-700 mb-2 font-semibold">
                    Registra tu experiencia culinaria
                </p>

                <p className="text-gray-600 mb-8 leading-relaxed">
                    Guarda recetas propias, registra cada intento que hagas y observa cómo evolucionan tus platos a lo largo del tiempo.
                </p>

                <div className="space-y-3 mb-12">
                    <div className="flex items-start gap-3">
                        <span className="text-blue-600 text-xl font-bold mt-1">✓</span>
                        <div className="text-left">
                            <p className="font-semibold text-gray-800">Guarda tus recetas</p>
                            <p className="text-sm text-gray-600">Crea y edita recetas personalizadas</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <span className="text-blue-600 text-xl font-bold mt-1">✓</span>
                        <div className="text-left">
                            <p className="font-semibold text-gray-800">Registra intentos</p>
                            <p className="text-sm text-gray-600">Cada vez que cocines, anota cómo salió</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <span className="text-blue-600 text-xl font-bold mt-1">✓</span>
                        <div className="text-left">
                            <p className="font-semibold text-gray-800">Aprende de tus cambios</p>
                            <p className="text-sm text-gray-600">Observa tu evolución en cada plato</p>
                        </div>
                    </div>
                </div>

                <Link
                    to="/recipes"
                    className="inline-block w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors mb-3"
                >
                    Comenzar
                </Link>

                <p className="text-xs text-gray-500">
                    Sin registros. Solo tus recetas, localmente en tu navegador.
                </p>
            </div>
        </div>
    );
}