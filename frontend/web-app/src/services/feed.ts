import api from '@/lib/api';
import { Post } from '@/types';

export async function getHomeFeed(): Promise<Post[]> {
  const res = await api.get<Post[]>('/api/feed/home');
  return res.data;
}

export async function getExploreFeed(): Promise<Post[]> {
  const res = await api.get<Post[]>('/api/feed/explore');
  return res.data;
}

export async function getUserPosts(userId: string): Promise<Post[]> {
  const res = await api.get<Post[]>(`/api/users/${userId}/posts`);
  return res.data;
}
