import { useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface BottomNavProps {
    onFabClick?: () => void;
}

export default function BottomNav({ onFabClick }: BottomNavProps) {
    const { isAuthenticated } = useAuth();

    const handleFabClick = useCallback(() => {
        if (onFabClick) {
            onFabClick();
        } else {
            window.dispatchEvent(new CustomEvent("fab-click"));
        }
    }, [onFabClick]);

    useEffect(() => {
        const handler = () => handleFabClick();
        window.addEventListener("fab-click", handler);
        return () => window.removeEventListener("fab-click", handler);
    }, [handleFabClick]);

    if (!isAuthenticated) return null;

    return (
        <nav className="fixed bottom-0 inset-x-0 z-50 glass-nav pb-[env(safe-area-inset-bottom,0px)] md:hidden">
            <div className="max-w-[420px] mx-auto flex items-center justify-between h-16 px-4">
                <Link
                    to="/recipes"
                    className="flex-1 flex flex-col items-center justify-center gap-1 min-h-[44px] text-primary font-bold transition-colors"
                >
                    <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="text-xs font-semibold tracking-wide uppercase">
                        Mis Recetas
                    </span>
                </Link>

                <div className="flex items-center justify-center px-1 shrink-0">
                    <button
                        type="button"
                        onClick={handleFabClick}
                        className="w-12 h-12 -mt-4 flex items-center justify-center rounded-full bg-primary text-on-primary shadow-[0_4px_12px_rgba(159,60,22,0.3)] hover:bg-primary-container transition-all active:scale-95"
                        aria-label="Nueva receta"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>

                <Link
                    to="/recipes"
                    className="flex-1 flex flex-col items-center justify-center gap-1 min-h-[44px] text-on-surface-variant hover:text-on-surface transition-colors"
                >
                    <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs font-semibold tracking-wide uppercase">
                        Historial
                    </span>
                </Link>

                <Link
                    to="/profile"
                    className="flex-1 flex flex-col items-center justify-center gap-1 min-h-[44px] text-on-surface-variant hover:text-on-surface transition-colors"
                >
                    <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs font-semibold tracking-wide uppercase">
                        Ajustes
                    </span>
                </Link>
            </div>
        </nav>
    );
}
