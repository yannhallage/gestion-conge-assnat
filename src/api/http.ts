// src/api/http.ts
const BASE_URL = "http://localhost:2001/api";

interface RequestOptions extends RequestInit {
    body?: any;
}

export const Http = async (endpoint: string, options: RequestOptions = {}) => {
    const url = `${BASE_URL}${endpoint}`;

    const config: RequestInit = {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
    };

    const res = await fetch(url, config);

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Erreur API inconnue");
    }

    return res.json();
};
