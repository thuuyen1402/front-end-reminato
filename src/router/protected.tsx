import { authStore } from "@stores/auth-store";
import { ReactNode } from "react";
import { Navigate } from "react-router";


export interface ProtectedRoute {
    children: ReactNode
}
export function ProtectedRoute({ children }: ProtectedRoute) {
    const { isAuth } = authStore();
    if (!isAuth ) {
        return <Navigate to="/" replace />;
    }

    return children;
}