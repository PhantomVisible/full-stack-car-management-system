// Auth Models - matching backend DTOs

export interface RegisterRequest {
  email: string;
  password: string;
  role?: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  email: string;
  role: string;
  message: string;
  token?: string;
}

export interface UserResponse {
  userId: number;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
}
