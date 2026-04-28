// ─── CONFIG ──────────────────────────────────────────────────────────────────
export const API = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api`;

// ─── API HELPERS ─────────────────────────────────────────────────────────────
export async function apiFetch(path, options = {}) {
	try {
		const r = await fetch(API + path, {
			headers: { "Content-Type": "application/json" },
			...options
		});
		return await r.json();
	} catch {
		return null; // backend offline → use mock
	}
}

// axiosInstance.ts
import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
	headers: {
		"Content-type": "application/json"
	}
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 429) {
			// Show friendly message instead of crashing
			return Promise.reject({
				message:
					error.response.data.message || "Too many requests. Please slow down.",
				isRateLimit: true
			});
		}
		return Promise.reject(error);
	}
);

export default api;
