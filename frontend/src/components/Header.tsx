import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import { usePrefetchNav } from "../hooks/usePrefetchNav";

const navLinks = [
    { to: "/recipes", label: "Recetas", end: false },
    { to: "/recetario", label: "Recetario", end: false },
] as const;

function navLinkClass({ isActive }: { isActive: boolean }) {
    return `text-sm px-1 py-0.5 border-b transition-colors ${isActive
        ? "text-primary border-primary"
        : "text-on-surface-variant border-transparent hover:text-on-surface"
        }`;
}

export default function Header() {
    const { theme, toggleTheme } = useTheme();
    const { user, isAuthenticated, logout } = useAuth();
    const { prefetch, cancelPrefetch } = usePrefetchNav();

    return (
        <header className="fixed top-0 inset-x-0 z-50 glass-header pt-[env(safe-area-inset-top,0px)]">
            <div className="h-16 px-4 md:px-8 lg:px-10 max-w-[74rem] mx-auto flex items-center justify-between gap-2">
                <Link to="/" className="flex items-center gap-2 min-w-0 shrink-0">
                    <span className="font-serif text-xl text-on-surface truncate">
                        MyRecipes
                    </span>
                </Link>

                {/* Desktop nav links */}
                {isAuthenticated && (
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                className={navLinkClass}
                                onMouseEnter={() => prefetch(link.to)}
                                onMouseLeave={() => cancelPrefetch(link.to)}
                                onFocus={() => prefetch(link.to)}
                                onBlur={() => cancelPrefetch(link.to)}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                )}

                <div className="flex items-center gap-1 shrink-0">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
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
                            <button
                                type="button"
                                onClick={logout}
                                className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-error transition-colors"
                                aria-label="Cerrar sesión"
                                title="Cerrar sesión"
                            >
                                <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                            <div className="w-px h-5 bg-outline-variant mx-1 hidden md:block" />
                            <NavLink
                                to="/profile"
                                className={({ isActive }) =>
                                    `hidden md:flex items-center gap-1.5 text-sm px-1 py-0.5 border-b transition-colors ${isActive
                                        ? "text-primary border-primary"
                                        : "text-on-surface-variant border-transparent hover:text-on-surface"
                                    }`
                                }
                            >
                                <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center">
                                    <span className="text-[10px] font-semibold text-primary">
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
                                <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                                    <span className="text-xs font-semibold text-primary">
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
