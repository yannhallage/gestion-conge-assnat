import { ACCESS_TOKEN_KEY } from "../secure/storageKeys";

//const BASE_URL = "https://assnat-api-nest.onrender.com";
const BASE_URL = "https://assnat-api-nest.vercel.app";
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

        // Extraire uniquement les propriétés valides pour fetch (exclure queryParams et token)
        const { queryParams, token, body, ...fetchOptions } = options;
        
        // Pour FormData, ne pas inclure Content-Type dans les headers (le navigateur le fait automatiquement)
        const finalHeaders = isFormData 
            ? Object.fromEntries(
                Object.entries(headers).filter(([key]) => key.toLowerCase() !== 'content-type')
            )
            : headers;
        
        const fetchConfig: RequestInit = {
            ...fetchOptions,
            method: options.method || 'GET',
            headers: finalHeaders,
            body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
        };
        
        // Log pour débogage (en développement uniquement)
        if (process.env.NODE_ENV === 'development') {
            console.log('[HTTP] Requête:', {
                url,
                method: fetchConfig.method,
                hasBody: !!body,
                isFormData,
                headers: Object.keys(finalHeaders),
            });
        }
        
        const res = await fetch(url, fetchConfig);

        const contentType = res.headers.get("content-type");

        // ❌ Gestion des erreurs HTTP
        if (!res.ok) {
            let errorMsg = await res.text();
            try {
                // Si on a déjà lu le texte, on ne peut pas le relire en JSON
                // On essaie de parser le texte comme JSON
                const json = JSON.parse(errorMsg);
                errorMsg = json.message || json.error || JSON.stringify(json);
            } catch {
                // Si ce n'est pas du JSON, on garde le texte tel quel
            }
            
            // Log détaillé de l'erreur en développement
            if (process.env.NODE_ENV === 'development') {
                console.error('[HTTP ERROR]', {
                    url,
                    method: options.method || 'GET',
                    status: res.status,
                    statusText: res.statusText,
                    error: errorMsg,
                });
            }
            
            throw new Error(errorMsg || `Erreur HTTP ${res.status}: ${res.statusText}`);
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
