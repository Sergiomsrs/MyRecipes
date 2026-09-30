import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { queryClient } from "./api/queryClient";
import { router } from "./router/router";
import "./index.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <RouterProvider router={router} />
                </AuthProvider>
            </QueryClientProvider>
        </ThemeProvider>
    </StrictMode>
);
