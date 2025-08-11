import api from "@/lib/api";
import {User, UpdateProfileRequest} from "@/types/index";

export async function getUser(userId:any) {
    const res = await api.get(`/api/users/${encodeURIComponent(userId)}`);
    return res.data
}

export async function updateProfile(data: UpdateProfileRequest, userId: any) {
    const res = await api.patch(`/api/users/${encodeURIComponent(userId)}`, data);
    return res.status;
}

export async function followUser(userId: any) {
    const res = await api.post(`/api/users/${encodeURIComponent(userId)}/follow`);
    return res.status;
}
export async function unfollowUser(userId: any) {
    const res = await api.post(`/api/users/${encodeURIComponent(userId)}/unfollow`);
    return res.status;
}
export async function getfollower(userId: any) {
    const res = await api.get(`/api/users/${encodeURIComponent(userId)}/followers`);
    return res.data;
}
export async function getfollowing(userId: any) {
    const res = await api.get(`/api/users/${encodeURIComponent(userId)}/following`);
    return res.data;
}
export async function searchUsers(keyword: string) {
    const res = await api.get(`/api/users/search?q=${encodeURIComponent(keyword)}`);
    return res.data;
}
