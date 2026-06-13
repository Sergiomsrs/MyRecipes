import { Link, NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const links = [
    { to: "/", label: "Inicio", end: true },
    { to: "/recipes", label: "Recetas", end: false },
];

function navLinkClass({ isActive }: { isActive: boolean }) {
    return `text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
        isActive
            ? "text-accent bg-accent/10"
            : "text-text-muted hover:text-text active:text-text"
    }`;
}

export default function NavBar() {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="sticky top-0 z-30 bg-bg/90 backdrop-blur-md border-b border-border w-full">
            <nav className="page-container flex items-center justify-between h-14 md:h-16 gap-4">
                <Link to="/" className="font-bold text-lg md:text-xl tracking-tight shrink-0">
                    <span className="gradient-text">Cuaderno</span>
                </Link>

                <div className="flex items-center gap-1 md:gap-2">
                    <ul className="flex items-center gap-0.5 md:gap-1">
                        {links.map((link) => (
                            <li key={link.to}>
                                <NavLink to={link.to} end={link.end} className={navLinkClass}>
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="p-2 ml-1 text-text-muted rounded-lg hover:bg-surface-raised active:bg-surface-raised transition-colors"
                        aria-label={theme === "light" ? "Activar tema oscuro" : "Activar tema claro"}
                    >
                        {theme === "light" ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                            </svg>
                        )}
                    </button>
                </div>
            </nav>
        </header>
    );
}
