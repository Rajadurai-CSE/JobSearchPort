// Auth Models

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'JOB_SEEKER' | 'EMPLOYER';
}

export interface RegisterResponse {
  userId: number;
  email: string;
  name: string;
  role: string;
  status: string;
}

export interface User {
  userId: number;
  email: string;
  role: string;
  status: string;
}

// JWT Payload structure (decoded from token)
export interface JwtPayload {
  sub: string;       // email
  userId: number;
  role: string;
  status: string;
  iat: number;
  exp: number;
}
