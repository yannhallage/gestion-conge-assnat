import { ACCESS_TOKEN_KEY } from "../secure/storageKeys";

//const BASE_URL = "https://assnat-api-nest.onrender.com";
const BASE_URL = "https://assnat-api-nest.vercel.app/api";
// const BASE_URL = "http://localhost:3003";

export interface RequestOptions extends RequestInit {
    body?: any;
    token?: string; // JWT ou autre token d'authentification
    queryParams?: Record<string, string | number>; // support des query params
}

export const Http = async <T = any>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> => {
    try {
        let url = `${BASE_URL}${endpoint}`;

        // 🔗 Gestion des query params
        if (options.queryParams) {
            const queryString = new URLSearchParams(
                Object.entries(options.queryParams).map(([k, v]) => [k, v.toString()])
            ).toString();
            url += `?${queryString}`;
        }

        // 🧱 Gestion propre des headers
        const isFormData = options.body instanceof FormData;
        const baseHeaders: Record<string, string> = {};
        
        // Ne pas définir Content-Type pour FormData (le navigateur le fait automatiquement)
        if (!isFormData) {
            baseHeaders["Content-Type"] = "application/json";
        }

        // On merge les headers fournis par l'utilisateur (si c'est un objet simple)
        const extraHeaders =
            options.headers && !(options.headers instanceof Headers)
                ? (options.headers as Record<string, string>)
                : {};

        const headers: Record<string, string> = {
            ...baseHeaders,
            ...extraHeaders,
        };

        // 🪪 Ajouter le token si fourni ou récupérer depuis le stockage
        const tokenFromOptions = options.token;
        const storedToken = tokenFromOptions ?? localStorage.getItem(ACCESS_TOKEN_KEY) ?? undefined;
        if (storedToken) {
            headers["Authorization"] = `Bearer ${storedToken}`;
        }

        const res = await fetch(url, {
            ...options,
            headers,
            body: options.body ? (isFormData ? options.body : JSON.stringify(options.body)) : undefined,
        });

        const contentType = res.headers.get("content-type");

        // ❌ Gestion des erreurs HTTP
        if (!res.ok) {
            let errorMsg = await res.text();
            try {
                if (contentType?.includes("application/json")) {
                    const json = await res.json();
                    errorMsg = json.message || JSON.stringify(json);
                }
            } catch {
                /* ignore parsing error */
            }
            throw new Error(errorMsg || `Erreur HTTP ${res.status}`);
        }

        // ✅ Retour JSON ou texte
        if (contentType?.includes("application/json")) {
            return res.json();
        }

        return (await res.text()) as unknown as T;
    } catch (err: any) {
        console.error(`[HTTP ERROR] ${endpoint}:`, err.message || err);
        throw err;
    }
};
