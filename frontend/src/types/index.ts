// Shared primitives and helpers
export type ID = string;
export type Nullable<T> = T | null;
export type ISODateString = string;

// Public-facing user shape returned by the API (password is never included)
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  inviteCode: string;
}
export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface InviteCodeRequest {
  intendedFor: string;
}

export interface User {
  _id: ID;
  username: string;
  email: string;
  displayName?: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  avatarUrl?: string;
  bio?: string;
  verified: boolean;
  followersCount: number;
  followingCount: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// Post document shape
export interface Post {
  _id: ID;
  authorId: ID;
  caption: string;
  mediaUrls: string[];
  likeCount: number;
  commentCount: number;
  reportsCount: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
export interface CreatePostRequest {
  caption: string;
  mediaUrls: string[];
}
// Comment document shape
export interface Comment {
  _id: ID;
  postId: ID;
  authorId: ID;
  content: string;
  createdAt: ISODateString;
}

// Like record shape
export interface LikeRecord {
  _id: ID;
  userId: ID;
  postId: ID;
  createdAt: ISODateString;
}

// Follow record shape
export interface FollowRecord {
  _id: ID;
  followerId: ID;
  followedId: ID;
  createdAt: ISODateString;
}


// Report record shape
export interface ReportRecord {
  _id: ID;
  userId: ID;
  postId: ID;
  reason: string;
  createdAt: ISODateString;
}

// Common API payloads




export interface ForgotPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface CheckUsernameResponse {
  exists: boolean;
}
export interface CheckEmailResponse {
  exists: boolean;
}

export interface MessageResponse {
  message: string;
}
export interface UpdateProfileRequest {
  displayName?: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  avatarUrl?: string;
  bio?: string;
}

// Utility generics for lists and pagination (future-proofing)
export type ListResponse<T> = T[];
