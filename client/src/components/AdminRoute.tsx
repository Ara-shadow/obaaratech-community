import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../context/AuthContext";

interface Props {
    children: React.ReactNode;
}

export default function AdminRoute({ children }: Props) {
    const { user } = useAuth();

    return (
        <ProtectedRoute>
            {user?.role === "ADMIN" || user?.role === "SUPER_ADMIN" ? (
                children
            ) : (
                <Navigate to="/" replace />
            )}
        </ProtectedRoute>
    );
}