import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RecipesPage from "../pages/RecipesPage";
import UserProfilePage from "../pages/UserProfilePage";
import NotFoundPage from "../pages/NotFoundPage";

export const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            {
                path: "/login",
                element: <LoginPage />,
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: "/recipes",
                        element: <RecipesPage />,
                    },
                    {
                        path: "/profile",
                        element: <UserProfilePage />,
                    },
                ],
            },
            {
                path: "*",
                element: <NotFoundPage />,
            },
        ],
    },
]);
