import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import DemoBanner from "../components/DemoBanner";
import { useAuth } from "../hooks/useAuth";

interface MainLayoutProps {
    onFabClick?: () => void;
}

export default function MainLayout({ onFabClick }: MainLayoutProps) {
    const { pathname } = useLocation();
    const { user, isAuthenticated } = useAuth();
    const isDemo = isAuthenticated && user?.role === "DEMO";

    return (
        <div className="min-h-screen bg-surface font-sans flex flex-col">
            <Header />
            <main className="flex-1 w-full pt-16 pb-20 md:pb-4">
                {isDemo && <DemoBanner />}
                <div key={pathname} className="animate-page-in">
                    <Outlet />
                </div>
            </main>
            <BottomNav onFabClick={onFabClick} />
        </div>
    );
}