import api, { setAuthToken } from "@/lib/api";
import { LoginRequest, LoginResponse } from "@/types";
import { useAuthStore } from "@/stores/authStore";

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>("/api/auth/login", data);
  setAuthToken(res.data.token);
  try {
    // No user profile returned yet; store token only
    useAuthStore.getState().setAuth(null as any, res.data.token);
  } catch (_) {}
  return res.data;
}

export async function logout() {
    const res = await api.post('/api/auth/logout');
    setAuthToken(null);
    try { useAuthStore.getState().clearAuth(); } catch (_) {}
    return res.status;
}