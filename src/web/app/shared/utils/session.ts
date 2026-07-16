import { queryClient } from "./query-client";

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export const ACCESS_TOKEN_KEY = "flow-forge-access-token";
export const USER_KEY = "flow-forge-user";

export function setSession(token: string, user: User) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  queryClient.setQueryData(["user"], user);
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  queryClient.clear();
}
