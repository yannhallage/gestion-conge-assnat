import { jwtDecode } from 'jwt-decode';
import { getSession } from "@/lib/localstorage";
import { Navigate } from 'react-router-dom';

const isTokenValid = (token: string): unknown => {
    try {
        const decoded: any = jwtDecode(token);
        const now = Date.now() / 1000;
        return decoded.exp > now;
    } catch {
        return false;
    }
};

const RedirectIfAuth = ({ children }: { children: React.ReactNode }) => {
    const session = getSession();
    const token = session.token_connexion;

    if (token && isTokenValid(token)) {
        return <Navigate to="/web" replace />;
    }

    return <>{children}</>;
};


export default RedirectIfAuth;
