import { getSession } from "@/lib/localstorage";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const session = getSession();

    if (session) {
        return <Navigate to="/web" replace />;
    }

    return <>{children}</>;
};

export default PublicRoute;
