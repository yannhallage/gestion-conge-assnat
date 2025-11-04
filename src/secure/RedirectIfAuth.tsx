// src/components/RedirectIfAuth.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const RedirectIfAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();

  if (token && user) {
    switch (user.role) {
      case "rh":
        return <Navigate to="/assnat-rh/dashboard/presence" replace />;
      case "admin":
        return <Navigate to="/assnat-admin/dashboard/presence" replace />;
      case "chef":
        return <Navigate to="/assnat-chef/dashboard/presence" replace />;
      default:
        return <Navigate to="/assnat-user/dashboard/presence" replace />;
    }
  }

  return <>{children}</>;
};

export default RedirectIfAuth;
