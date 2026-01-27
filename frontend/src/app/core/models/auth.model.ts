export interface User {
  userId: number;
  email: string;
  role: 'ADMIN' | 'EMPLOYER' | 'JOB_SEEKER';
  status: 'PENDING' | 'APPROVED' | 'REVOKED' | 'DENIED';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  email: string;
  role: 'ADMIN' | 'EMPLOYER' | 'JOB_SEEKER';
  status: 'PENDING' | 'APPROVED' | 'REVOKED' | 'DENIED';
  message: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: 'EMPLOYER' | 'JOB_SEEKER';
}

export interface RegisterResponse {
  email: string;
  role: string;
  status: string;
}
