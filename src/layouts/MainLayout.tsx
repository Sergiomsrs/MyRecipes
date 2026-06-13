import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function MainLayout() {
    return (
        <div className="min-h-screen bg-bg text-text font-sans w-full flex flex-col">
            <NavBar />
            <main className="flex-1 w-full">
                <Outlet />
            </main>
        </div>
    );
}
