import api from '@/lib/api';
import { User } from '@/types';

export async function followUser(userId: string): Promise<{ message: string }> {
  const res = await api.post(`/api/users/${userId}/follow`);
  return res.data;
}

export async function unfollowUser(userId: string): Promise<{ message: string }> {
  const res = await api.post(`/api/users/${userId}/unfollow`);
  return res.data;
}

export async function getFollowers(userId: string): Promise<User[]> {
  const res = await api.get<User[]>(`/api/users/${userId}/followers`);
  return res.data;
}

export async function getFollowing(userId: string): Promise<User[]> {
  const res = await api.get<User[]>(`/api/users/${userId}/following`);
  return res.data;
}

export async function searchUsers(query: string): Promise<User[]> {
  const res = await api.get<User[]>(`/api/users/search?q=${encodeURIComponent(query)}`);
  return res.data;
}
