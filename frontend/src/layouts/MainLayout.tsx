import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

interface MainLayoutProps {
    onFabClick?: () => void;
}

export default function MainLayout({ onFabClick }: MainLayoutProps) {
    const { pathname } = useLocation();

    return (
        <div className="min-h-screen bg-surface font-sans flex flex-col">
            <Header />
            <main
                key={pathname}
                className="animate-page-in flex-1 w-full pt-16 pb-20 md:pb-4"
            >
                <Outlet />
            </main>
            <BottomNav onFabClick={onFabClick} />
        </div>
    );
}
