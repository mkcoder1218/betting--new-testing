import React from "react";
import { Route, Navigate, RouteProps } from "react-router-dom";
import { useAppSelector } from "../features/hooks";

interface ProtectedRouteProps {
    element: React.ReactNode;
}

const AuthGuard: React.FC<ProtectedRouteProps> = ({
    element,
    ...props
}) => {
    const user = useAppSelector(state => state.user);

    return user.user ? (
        element
    ) : (
        <Navigate to="/" replace />
    );
};

export default AuthGuard;
