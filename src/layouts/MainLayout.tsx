import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <main className="min-h-screen bg-gray-50 max-w-md mx-auto relative">
            <Outlet />
        </main>
    );
}