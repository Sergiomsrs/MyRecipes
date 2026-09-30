import axios from "axios";

declare module "axios" {
    export interface AxiosRequestConfig {
        skipAuthRedirect?: boolean;
    }
}

type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;
let isLoggingOut = false;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
    unauthorizedHandler = handler;
}

function clearStoredSession() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => {
        isLoggingOut = false;
        return response;
    },
    (error) => {
        if (
            error.response?.status === 401 &&
            !error.config?.skipAuthRedirect
        ) {
            if (!isLoggingOut) {
                isLoggingOut = true;
                clearStoredSession();
                unauthorizedHandler?.();
            }
        }
        return Promise.reject(error);
    }
);

export default api;
