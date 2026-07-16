import ky from "ky";
import { getToken, setSession, clearSession } from "./session";
import { getActiveOrgId } from "./active-org";
import type { User } from "./session";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : token && prom.resolve(token);
  });
  failedQueue = [];
};

export const http = ky.create({
  prefix: API_URL,
  credentials: "include", // sends cookies (like refreshToken) on every request
  hooks: {
    beforeRequest: [
      (request) => {
        const token = getToken();
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
        const orgId = getActiveOrgId();
        if (orgId) {
          request.headers.set("X-Organization-Id", orgId);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401 && !request.url.includes("/auth/login") && !request.url.includes("/auth/register")) {
          if (isRefreshing) {
            return new Promise<string>((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                options.headers = { ...options.headers, Authorization: `Bearer ${token}` };
                return ky(request, options);
              })
              .catch((err) => Promise.reject(err));
          }

          isRefreshing = true;
          try {
            // Call refresh endpoint
            // In NestJS, POST /api/v1/auth/refresh rotates the refresh token using the cookie.
            // We must call it with credentials: 'include'.
            const refreshRes = await ky
              .post(`${API_URL}/auth/refresh`, { credentials: "include" })
              .json<{ accessToken: string; user: User }>();

            const newAccessToken = refreshRes.accessToken;
            const user = refreshRes.user;

            processQueue(null, newAccessToken);
            setSession(newAccessToken, user);

            return ky(request, {
              ...options,
              headers: { ...options.headers, Authorization: `Bearer ${newAccessToken}` },
            });
          } catch (refreshError) {
            processQueue(refreshError, null);
            clearSession();
            // Since we are in client-side / SPA, we can do window.location.href or redirect.
            // Let's redirect to /login
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
            throw refreshError;
          } finally {
            isRefreshing = false;
          }
        }
        return response;
      },
    ],
  },
});
