import api from "@/lib/api";
import {Post, Comment, LikeRecord, ReportRecord, CreatePostRequest} from "@/types/index";

export async function createPost(data:CreatePostRequest) {
    const res = await api.post('/api/posts', data);
    return res.status;  
}

export async function reportPost(reason: string, postId: string) {
    const trimmed = (reason ?? '').toString().trim();
    if (!trimmed) throw new Error('Reason required.');
    const res = await api.post(`/api/posts/${encodeURIComponent(postId)}/report`, { reason: trimmed });
    return res.status;
}

export async function getPostbyId(postId: any) {
    const res = await api.get(`/api/posts/${encodeURIComponent(postId)}`);
    return res.data;
}
export async function deletePost(postId: any) {
    const res = await api.delete(`/api/posts/${encodeURIComponent(postId)}`);
    return res.data;
}
export async function editPost(postId: any, caption: any) {
    const res = await api.patch(`/api/posts/${encodeURIComponent(postId)}`, {caption});
    return res.data;
}
export async function likePost(postId: any) {
    const res = await api.post(`/api/posts/${encodeURIComponent(postId)}/like`);
    return res.status;
}
export async function unlikePost(postId: any) {
    const res = await api.post(`/api/posts/${encodeURIComponent(postId)}/unlike`);
    return res.status;
}
export async function getPostLikes(postId: any) {
    const res = await api.get(`/api/posts/${encodeURIComponent(postId)}/likes`);
    return res.data;
}
export async function addComment(postId: any, content: string) {
    const res = await api.post(`/api/posts/${encodeURIComponent(postId)}/comments`, { content });
    return res.data;
}
export async function deleteComment(commentId: any) {
    const res = await api.delete(`/api/comments/${encodeURIComponent(commentId)}`);
    return res.data;
}
export async function editComment(commentId: any, content: string) {
    const res = await api.patch(`/api/comments/${encodeURIComponent(commentId)}`, { content });
    return res.status;
}
export async function homeFeed() {
    const res = await api.get(`/api/feed/home`);
    return res.data;
}
export async function exploreFeed() {
    const res = await api.get(`/api/feed/explore`);
    return res.data;
}
export async function userPost(userId: any) {
    const res = await api.get(`/api/users/${encodeURIComponent(userId)}/posts`);
    return res.data;
}
