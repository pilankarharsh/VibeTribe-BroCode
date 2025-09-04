import api from "@/lib/api";
import {User, UpdateProfileRequest} from "@/types/index";
import { useAuthStore } from "@/stores/authStore";

export async function getUser(userId: string) {
    const res = await api.get(`/api/users/${encodeURIComponent(userId)}`);
    return res.data
}

export async function updateProfile(data: UpdateProfileRequest, userId: string) {
    try {
        console.log('🔧 API updateProfile called with:', { data, userId });
        const url = `/api/users/${encodeURIComponent(userId)}`;
        console.log('🌐 Making PATCH request to:', url);
        
        const res = await api.patch<User>(url, data);
        console.log('✅ API updateProfile success:', res.data);
        
        // Update the user in the auth store if this is the current user
        try {
            const currentUser = useAuthStore.getState().user;
            if (currentUser && currentUser._id === userId) {
                useAuthStore.getState().updateUser(res.data);
            }
        } catch { /* ignore */ }
        
        return res.data;
    } catch (error: unknown) {
        // Properly type the axios error structure
        interface AxiosError {
            message?: string;
            response?: {
                data?: unknown;
                status?: number;
            };
            config?: {
                url?: string;
                method?: string;
                headers?: unknown;
            };
        }
        
        const axiosError = error as AxiosError;
        console.error('❌ API updateProfile failed:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            response: axiosError?.response?.data,
            status: axiosError?.response?.status,
            url: axiosError?.config?.url,
            method: axiosError?.config?.method,
            headers: axiosError?.config?.headers
        });
        throw error;
    }
}