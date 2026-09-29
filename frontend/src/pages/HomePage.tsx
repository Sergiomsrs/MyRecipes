import { Link } from "react-router-dom";
import HeroIllustration from "../components/HeroIllustration";

const steps = [
    {
        number: "1",
        title: "Apunta lo que sabes",
        description:
            "Ingredientes, pasos, lo que sea. La primera versión nunca es la definitiva, y eso está bien.",
    },
    {
        number: "2",
        title: "Cocina y anota qué cambiaste",
        description:
            "La próxima vez que cocines, apunta qué ajustaste. Un gramo de sal, cinco minutos menos. Eso es un dato, no un error.",
    },
    {
        number: "3",
        title: "Busca la que mejor funcionó",
        description:
            "Sin adivinar. Sin memoria. La versión que salió increíble está aquí, con todos los cambios que hiciste para lograrla.",
    },
];

const tortillaAttempts = [
    {
        attempt: 1,
        mood: "😐",
        label: "Demasiado seca",
        changes: ["5 huevos"],
    },
    {
        attempt: 2,
        mood: "🙂",
        label: "Mucho mejor",
        changes: ["6 huevos"],
    },
    {
        attempt: 3,
        mood: "😍",
        label: "La mejor hasta ahora",
        changes: ["6 huevos", "Menos tiempo de cocción"],
        highlight: true,
    },
];

export default function HomePage() {
    return (
        <div className="min-h-full flex flex-col">
            {/* Hero */}
            <section className="landing-section gradient-glow">
                <div className="page-container lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
                    <div>
                        <p className="section-label mb-5">Tu cuaderno de cocina</p>
                        <h1 className="font-serif text-[2rem] md:text-5xl leading-[1.1] tracking-tight mb-6">
                            La receta es solo el borrador.{" "}
                            <span className="gradient-text">La ejecución es tuya.</span>
                        </h1>
                        <p className="text-on-surface-variant text-base md:text-lg leading-relaxed mb-6">
                            Pruebas, ajustas un ingrediente, cambias el tiempo de
                            cocción... y un día sale increíble.{" "}
                            <span className="text-on-surface font-medium">
                                MyRecipes guarda exactamente qué hiciste
                            </span>{" "}
                            para que nunca pierdas la versión que mejor funcionó.
                        </p>
                        <Link to="/recipes" className="btn-primary max-w-xs">
                            Empezar a crear mi recetario
                        </Link>
                    </div>

                    <div className="hidden lg:block">
                        <HeroIllustration className="w-full" />
                    </div>
                </div>
            </section>

            <hr className="landing-divider" />

            {/* Manifiesto */}
            <section className="landing-section">
                <div className="page-container max-w-2xl">
                    <blockquote className="border-l-2 border-primary pl-6 py-1">
                        <p className="font-serif text-lg md:text-xl text-on-surface-variant leading-relaxed italic">
                            Un plato perfecto no sale a la primera. Requiere
                            probar, corregir un gramo de sal, ajustar cinco minutos
                            de horno y volver a intentarlo la semana que viene.
                        </p>
                    </blockquote>
                </div>
            </section>

            <hr className="landing-divider" />

            {/* Cómo funciona */}
            <section className="landing-section">
                <div className="page-container">
                    <p className="section-label mb-3">Cómo funciona</p>
                    <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-10">
                        Tres pasos. Sin complicaciones.
                    </h2>

                    <div className="grid gap-8 md:grid-cols-3 md:gap-10">
                        {steps.map((step) => (
                            <div key={step.number}>
                                <span className="block text-sm text-primary font-medium mb-2 tabular-nums">
                                    {step.number}
                                </span>
                                <h3 className="font-serif text-on-surface text-lg mb-1.5">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-on-surface-variant leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Ejemplo */}
            <section className="landing-section">
                <div className="page-container">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
                        <div className="mb-8 lg:mb-0">
                            <p className="section-label mb-3">Un ejemplo real</p>
                            <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-4">
                                Tortilla de patatas
                            </h2>
                            <p className="text-on-surface-variant leading-relaxed">
                                Meses después seguirás sabiendo exactamente qué
                                versión te funcionó. Este es el historial que
                                guarda MyRecipes por cada receta.
                            </p>
                        </div>

                        <div>
                            {tortillaAttempts.map((entry, index) => (
                                <div
                                    key={entry.attempt}
                                    className={`py-4 ${
                                        index > 0
                                            ? "border-t border-outline-variant/40"
                                            : ""
                                    } ${
                                        entry.highlight
                                            ? "border-l-2 border-primary pl-4 -ml-4"
                                            : "pl-4 -ml-4"
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-primary">
                                            Intento {entry.attempt}
                                        </span>
                                        <span className="text-sm" aria-hidden="true">
                                            {entry.mood}
                                        </span>
                                    </div>
                                    <p className="text-on-surface mb-2">{entry.label}</p>
                                    <ul className="space-y-0.5">
                                        {entry.changes.map((change) => (
                                            <li
                                                key={change}
                                                className="text-sm text-on-surface-variant"
                                            >
                                                {change}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA final */}
            <section className="landing-section gradient-glow pb-20">
                <div className="page-container max-w-2xl mx-auto text-center">
                    <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-4">
                        Tu mejor receta aún está{" "}
                        <span className="gradient-text">evolucionando</span>
                    </h2>
                    <p className="text-on-surface-variant text-base md:text-lg leading-relaxed mb-8">
                        Empieza a registrar cada intento y construye tu propio
                        historial culinario.
                    </p>
                    <Link to="/recipes" className="btn-primary max-w-xs mx-auto">
                        Empezar ahora
                    </Link>
                    <p className="text-xs text-on-surface-variant mt-6">
                        Recetas en el servidor · intentos en tu navegador
                    </p>
                </div>
            </section>
        </div>
    );
}
