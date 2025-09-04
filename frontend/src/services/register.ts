import api, { setAuthToken } from "@/lib/api";
import { RegisterRequest, LoginResponse, CheckUsernameResponse, CheckEmailResponse } from "@/types";
import { useAuthStore } from "@/stores/authStore";

export async function register(data: RegisterRequest): Promise<LoginResponse> {
    const res = await api.post<LoginResponse>('/api/auth/register', data);
    setAuthToken(res.data.token);
    try {
        useAuthStore.getState().setAuth(res.data.user, res.data.token);
    } catch { /* ignore */ }
    return res.data;
}
export async function checkUsername(username: string): Promise<boolean> {
    const res = await api.get<CheckUsernameResponse>(`/api/users/check-username?username=${encodeURIComponent(username)}`);
    return Boolean(res.data?.exists);
}

export async function checkEmail(email: string): Promise<boolean> {
    const res = await api.get<CheckEmailResponse>(`/api/users/check-email?email=${encodeURIComponent(email)}`);
    return Boolean(res.data?.exists);
}