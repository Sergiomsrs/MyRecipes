import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { usePrefetchNav } from "../hooks/usePrefetchNav";

function navLinkClass({ isActive }: { isActive: boolean }) {
    return `min-w-0 flex flex-col items-center justify-center gap-1 min-h-[44px] text-[10px] font-semibold uppercase transition-colors ${isActive
        ? "text-primary"
        : "text-on-surface-variant hover:text-on-surface"
        }`;
}

export default function BottomNav() {
    const { isAuthenticated } = useAuth();
    const { prefetch, cancelPrefetch } = usePrefetchNav();

    if (!isAuthenticated) return null;

    return (
        <nav className="fixed bottom-0 inset-x-0 z-50 glass-nav pb-[env(safe-area-inset-bottom,0px)] md:hidden">
            <div className="max-w-[420px] mx-auto grid grid-cols-3 items-center h-16 px-4">
                <NavLink
                    to="/recipes"
                    end={false}
                    onMouseEnter={() => prefetch("/recipes")}
                    onMouseLeave={() => cancelPrefetch("/recipes")}
                    onFocus={() => prefetch("/recipes")}
                    onBlur={() => cancelPrefetch("/recipes")}
                    className={navLinkClass}
                >
                    <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="text-xs font-semibold tracking-wide uppercase">
                        Mis Recetas
                    </span>
                </NavLink>

                <NavLink
                    to="/recetario"
                    onMouseEnter={() => prefetch("/recetario")}
                    onMouseLeave={() => cancelPrefetch("/recetario")}
                    onFocus={() => prefetch("/recetario")}
                    onBlur={() => cancelPrefetch("/recetario")}
                    className={navLinkClass}
                >
                    <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="text-xs font-semibold tracking-wide uppercase">
                        Recetario
                    </span>
                </NavLink>

                <NavLink
                    to="/profile"
                    className={navLinkClass}
                >
                    <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs font-semibold tracking-wide uppercase">
                        Ajustes
                    </span>
                </NavLink>
            </div>
        </nav>
    );
}
