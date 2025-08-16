import api, { setAuthToken } from "@/lib/api";
import { LoginRequest, LoginResponse } from "@/types";
import { useAuthStore } from "@/stores/authStore";

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>("/api/auth/login", data);
  setAuthToken(res.data.token);
  try {
    // Store user data and token
    useAuthStore.getState().setAuth(res.data.user, res.data.token);
  } catch { /* ignore */ }
  return res.data;
}

export async function logout() {
    const res = await api.post('/api/auth/logout');
    setAuthToken(null);
    try { useAuthStore.getState().clearAuth(); } catch { /* ignore */ }
    return res.status;
}