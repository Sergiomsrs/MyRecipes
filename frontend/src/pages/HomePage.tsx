import { Link } from "react-router-dom";

const familiarQuotes = [
    "Hice una lasaña espectacular hace dos meses, pero no recuerdo qué cambié.",
    "Esta tortilla salió perfecta. Ojalá hubiera apuntado cuánto tiempo la dejé.",
    "La última vez usé otra marca de tomate y quedó mucho mejor.",
];

const solutionPoints = [
    "Guarda tus recetas.",
    "Registra cada vez que las cocines.",
    "Anota qué cambiaste.",
    "Guarda fotos del resultado.",
    "Descubre qué versiones funcionaron mejor.",
];

const steps = [
    {
        number: "1",
        title: "Guarda tu receta",
        description: "Añade ingredientes, pasos y notas iniciales.",
    },
    {
        number: "2",
        title: "Registra cada intento",
        description:
            "Cada vez que cocines la receta, guarda los cambios realizados y cómo ha salido.",
    },
    {
        number: "3",
        title: "Consulta tu evolución",
        description:
            "Revisa el historial completo y recuerda exactamente qué hiciste cuando obtuviste el mejor resultado.",
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

const benefits = [
    {
        title: "Nunca olvides una mejora",
        description: "Guarda cada ajuste que hagas en una receta.",
    },
    {
        title: "Conserva tu experiencia",
        description: "Las recetas evolucionan contigo.",
    },
    {
        title: "Menos improvisación, mejores resultados",
        description: "Recupera rápidamente las versiones que mejor funcionaron.",
    },
    {
        title: "Tu cocina, tus reglas",
        description: "No dependes de recetas genéricas de internet.",
    },
];

const philosophyPoints = [
    "Equivocarse",
    "Ajustar",
    "Repetir",
    "Aprender",
];

function SectionLabel({ children }: { children: React.ReactNode }) {
    return <p className="section-label mb-3">{children}</p>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-text mb-6">
            {children}
        </h2>
    );
}

export default function HomePage() {
    return (
        <div className="min-h-full flex flex-col">
            {/* Hero */}
            <section className="landing-section gradient-glow">
                <div className="page-container max-w-3xl">
                    <h1 className="text-[2rem] md:text-4xl lg:text-5xl leading-[1.12] font-bold tracking-tight mb-8">
                        <span className="gradient-text">
                            Tus recetas evolucionan contigo
                        </span>
                    </h1>

                    <div className="space-y-4 text-text-muted text-base md:text-lg leading-relaxed mb-10">
                        <p>Las mejores recetas no nacen perfectas.</p>
                        <p>
                            Pruebas una vez. Cambias un ingrediente. Ajustas el
                            tiempo de cocción. Añades una especia. Te equivocas.
                            Aprendes.
                        </p>
                        <p className="text-text font-medium">
                            Y un día sale increíble.
                        </p>
                        <p>Pero semanas después ya no recuerdas exactamente qué hiciste.</p>
                        <p>
                            <span className="text-text font-medium">Cuaderno</span>{" "}
                            te ayuda a registrar cada intento para que nunca pierdas
                            la versión que mejor te funcionó.
                        </p>
                    </div>

                    <Link to="/recipes" className="btn-primary max-w-xs">
                        Empieza gratis
                    </Link>
                </div>
            </section>

            <hr className="landing-divider" />

            {/* Problema */}
            <section className="landing-section">
                <div className="page-container max-w-3xl">
                    <SectionLabel>El problema</SectionLabel>
                    <SectionTitle>¿Te suena familiar?</SectionTitle>

                    <div className="space-y-5 mb-10">
                        {familiarQuotes.map((quote) => (
                            <blockquote key={quote} className="landing-quote text-base md:text-lg">
                                "{quote}"
                            </blockquote>
                        ))}
                    </div>

                    <div className="space-y-4 text-text-muted leading-relaxed">
                        <p>
                            Cocinar no consiste en seguir instrucciones. Consiste en
                            aprender, experimentar e iterar.
                        </p>
                        <p>
                            Sin embargo, la mayoría de aplicaciones de recetas solo
                            muestran versiones estáticas.
                        </p>
                        <p className="text-text font-semibold text-lg">
                            Tu experiencia desaparece después de cada plato.
                        </p>
                    </div>
                </div>
            </section>

            <hr className="landing-divider" />

            {/* Solución */}
            <section className="landing-section bg-surface-raised/50">
                <div className="page-container max-w-3xl">
                    <SectionLabel>La solución</SectionLabel>
                    <SectionTitle>
                        Convierte cada receta en un historial de aprendizaje
                    </SectionTitle>

                    <ul className="space-y-3 mb-8">
                        {solutionPoints.map((point) => (
                            <li
                                key={point}
                                className="flex items-start gap-3 text-text-muted"
                            >
                                <span className="text-accent mt-1 shrink-0">→</span>
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>

                    <p className="text-lg md:text-xl font-semibold text-text">
                        Porque las recetas más importantes son las tuyas.
                    </p>
                </div>
            </section>

            <hr className="landing-divider" />

            {/* Cómo funciona */}
            <section className="landing-section">
                <div className="page-container">
                    <SectionLabel>Cómo funciona</SectionLabel>
                    <SectionTitle>Tres pasos. Sin complicaciones.</SectionTitle>

                    <div className="grid gap-6 md:grid-cols-3">
                        {steps.map((step) => (
                            <div key={step.number} className="card p-5 md:p-6">
                                <span className="inline-flex items-center justify-center size-8 bg-accent/15 text-accent rounded-lg font-mono text-sm font-medium mb-4">
                                    {step.number}
                                </span>
                                <h3 className="font-semibold text-text text-lg mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-text-muted leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <hr className="landing-divider" />

            {/* Ejemplo */}
            <section className="landing-section bg-surface-raised/50">
                <div className="page-container">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
                        <div className="mb-8 lg:mb-0">
                            <SectionLabel>Un ejemplo real</SectionLabel>
                            <SectionTitle>Tortilla de patatas</SectionTitle>
                            <p className="text-text-muted leading-relaxed">
                                Meses después seguirás sabiendo exactamente qué
                                versión te funcionó.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {tortillaAttempts.map((entry) => (
                                <div
                                    key={entry.attempt}
                                    className={`card p-4 ${
                                        entry.highlight
                                            ? "border-accent/40 bg-accent/5"
                                            : ""
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-mono text-xs text-accent">
                                            Intento #{entry.attempt}
                                        </span>
                                        <span className="text-xl">{entry.mood}</span>
                                    </div>
                                    <p className="font-medium text-text mb-2">
                                        {entry.label}
                                    </p>
                                    <ul className="space-y-1">
                                        {entry.changes.map((change) => (
                                            <li
                                                key={change}
                                                className="text-sm text-text-muted flex items-center gap-2"
                                            >
                                                <span className="text-border">·</span>
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

            <hr className="landing-divider" />

            {/* Beneficios */}
            <section className="landing-section">
                <div className="page-container">
                    <SectionLabel>Beneficios</SectionLabel>
                    <SectionTitle>Aprende de tu propia cocina</SectionTitle>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {benefits.map((benefit) => (
                            <div key={benefit.title} className="card p-5">
                                <h3 className="font-semibold text-text mb-2">
                                    {benefit.title}
                                </h3>
                                <p className="text-sm text-text-muted leading-relaxed">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <hr className="landing-divider" />

            {/* Filosofía */}
            <section className="landing-section">
                <div className="page-container max-w-3xl mx-auto text-center">
                    <SectionLabel>Filosofía</SectionLabel>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-8">
                        <span className="gradient-text">Cocinar es iterar</span>
                    </h2>

                    <div className="space-y-4 text-text-muted leading-relaxed mb-10 text-left md:text-center">
                        <p>Las recetas de los vídeos parecen perfectas.</p>
                        <p className="text-text font-medium">La cocina real no funciona así.</p>
                        <p>La cocina real implica:</p>
                    </div>

                    <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                        {philosophyPoints.map((point) => (
                            <li
                                key={point}
                                className="card px-4 py-3 text-sm font-medium text-text"
                            >
                                {point}
                            </li>
                        ))}
                    </ul>

                    <div className="space-y-4 text-text-muted leading-relaxed text-left md:text-center max-w-2xl mx-auto">
                        <p>
                            <span className="text-text font-medium">Cuaderno</span> está
                            diseñado para acompañar ese proceso.
                        </p>
                        <p>No para enseñarte recetas.</p>
                        <p className="text-text font-semibold text-lg">
                            Sino para ayudarte a recordar por qué las tuyas salieron tan bien.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA final */}
            <section className="landing-section gradient-glow pb-20">
                <div className="page-container max-w-2xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                        <span className="gradient-text">
                            Tu mejor receta aún está evolucionando
                        </span>
                    </h2>
                    <p className="text-text-muted text-base md:text-lg leading-relaxed mb-8">
                        Empieza a registrar cada intento y construye tu propio
                        historial culinario.
                    </p>
                    <Link to="/recipes" className="btn-primary max-w-xs mx-auto">
                        Empezar ahora
                    </Link>
                    <p className="font-mono text-xs text-text-muted mt-6">
                        Sin registros · solo en tu navegador
                    </p>
                </div>
            </section>
        </div>
    );
}
