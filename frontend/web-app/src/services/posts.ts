import api from '@/lib/api';
import { Post, CreatePostRequest, Comment } from '@/types';

export async function createPost(data: CreatePostRequest): Promise<Post> {
  const res = await api.post<Post>('/api/posts', data);
  return res.data;
}

export async function getPost(postId: string): Promise<Post> {
  const res = await api.get<Post>(`/api/posts/${postId}`);
  return res.data;
}

export async function editPost(postId: string, caption: string): Promise<Post> {
  const res = await api.patch<Post>(`/api/posts/${postId}`, { caption });
  return res.data;
}

export async function deletePost(postId: string): Promise<void> {
  await api.delete(`/api/posts/${postId}`);
}

export async function likePost(postId: string): Promise<{ message: string }> {
  const res = await api.post(`/api/posts/${postId}/like`);
  return res.data;
}

export async function unlikePost(postId: string): Promise<{ message: string }> {
  const res = await api.post(`/api/posts/${postId}/unlike`);
  return res.data;
}

export async function getPostLikes(postId: string) {
  const res = await api.get(`/api/posts/${postId}/likes`);
  return res.data;
}

export async function isPostLikedByUser(postId: string, currentUserId?: string): Promise<{ isLiked: boolean }> {
  try {
    if (!currentUserId) {
      return { isLiked: false };
    }
    
    const res = await api.get(`/api/posts/${postId}/likes`);
    const likingUsers = res.data; // Array of user objects who liked the post
    
    // Check if current user ID is in the list of users who liked the post
    const isLiked = Array.isArray(likingUsers) && 
      likingUsers.some((user: { _id: string }) => user._id === currentUserId);
    
    return { isLiked };
  } catch (likeCheckError) {
    console.error('Failed to check like status:', likeCheckError);
    return { isLiked: false };
  }
}

export async function addComment(postId: string, content: string): Promise<Comment> {
  const res = await api.post<Comment>(`/api/posts/${postId}/comments`, { content });
  return res.data;
}

export async function getComments(postId: string): Promise<Comment[]> {
  const res = await api.get<Comment[]>(`/api/posts/${postId}/comments`);
  return res.data;
}

export async function deleteComment(commentId: string): Promise<void> {
  await api.delete(`/api/comments/${commentId}`);
}

export async function editComment(commentId: string, content: string): Promise<Comment> {
  const res = await api.patch<Comment>(`/api/comments/${commentId}`, { content });
  return res.data;
}

export async function reportPost(postId: string, reason: string): Promise<{ message: string }> {
  const res = await api.post(`/api/posts/${postId}/report`, { reason });
  return res.data;
}