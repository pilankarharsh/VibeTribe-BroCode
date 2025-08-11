import api from "@/lib/api";
import { ChangePasswordRequest, ForgotPasswordRequest} from "@/types";

export async function changePassword(data:ChangePasswordRequest) {
    const res = await api.post('/api/account/change-password',data);
    return res.status;
}
export async function resetPassword(data:ForgotPasswordRequest) {
    const res = await api.post('/api/auth/forgot-password', data);
    return res.status;
}
export async function deleteAccount() {
    const res = await api.delete('/api/account');
    return res.status;
}