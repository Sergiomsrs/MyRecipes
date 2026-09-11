export default function LoginPage() {
    return (
        <div className="min-h-full flex flex-col items-center justify-center px-5 gradient-glow py-20 text-center">
            <span className="chip mb-6">
                <span className="text-base leading-none">🥘</span>
                Cuaderno
            </span>
            <h1 className="font-serif font-semibold text-3xl tracking-tight mb-2">
                <span className="gradient-text">Iniciar sesión</span>
            </h1>
            <p className="text-sm text-text-muted max-w-xs leading-relaxed">
                Próximamente. Por ahora las recetas se guardan en el servidor y los
                intentos en tu navegador.
            </p>
        </div>
    );
}