import api from "@/lib/api";
import { InviteCodeRequest } from "@/types";

export async function generatedInviteCode(data: InviteCodeRequest) {
    const res = await api.post('/api/auth/invite-code', data);
    return res.data;
}
export async function listInviteCodes() {
    const res = await api.get('/api/auth/invite-codes');
    return res.data;
}
export async function revokeInviteCode(code: string) {
    const res = await api.delete(`/api/auth/invite-codes/${encodeURIComponent(code)}`);
    return res.status;
}