import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";

const navLinks = [
    { to: "/recipes", label: "Recetas", end: false },
];

function navLinkClass({ isActive }: { isActive: boolean }) {
    return `text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
        isActive
            ? "text-primary bg-primary/10"
            : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
    }`;
}

export default function Header() {
    const { theme, toggleTheme } = useTheme();
    const { user, isAuthenticated } = useAuth();

    return (
        <header className="fixed top-0 inset-x-0 z-50 glass-header pt-[env(safe-area-inset-top,0px)]">
            <div className="h-16 px-4 max-w-7xl mx-auto flex items-center justify-between gap-2">
                <Link to="/" className="flex items-center gap-2 min-w-0 shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-on-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1">
                            <span className="font-serif font-semibold text-lg text-on-surface truncate">
                                MyRecipes
                            </span>
                            <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant shrink-0 hidden sm:inline">
                                v1.4
                            </span>
                        </div>
                        <span className="text-xs text-on-surface-variant truncate hidden sm:block">
                            Mis Recetas
                        </span>
                    </div>
                </Link>

                {/* Desktop nav links */}
                {isAuthenticated && (
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <NavLink key={link.to} to={link.to} end={link.end} className={navLinkClass}>
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                )}

                <div className="flex items-center gap-1 shrink-0">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface transition-colors"
                        aria-label={theme === "light" ? "Activar tema oscuro" : "Activar tema claro"}
                    >
                        {theme === "light" ? (
                            <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        ) : (
                            <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        )}
                    </button>
                    {isAuthenticated && (
                        <>
                            <div className="w-px h-5 bg-outline-variant mx-1 hidden md:block" />
                            <NavLink
                                to="/profile"
                                className={({ isActive }) =>
                                    `hidden md:flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                                        isActive
                                            ? "text-primary bg-primary/10"
                                            : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                                    }`
                                }
                            >
                                <div className="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-on-primary-container">
                                        {user?.email?.charAt(0).toUpperCase() || "U"}
                                    </span>
                                </div>
                                <span className="truncate max-w-[100px]">
                                    {user?.email?.split("@")[0]}
                                </span>
                            </NavLink>
                            <Link
                                to="/profile"
                                className="w-10 h-10 flex items-center justify-center md:hidden"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center ring-2 ring-surface-container-high">
                                    <span className="text-xs font-semibold text-on-primary-container">
                                        {user?.email?.charAt(0).toUpperCase() || "U"}
                                    </span>
                                </div>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
