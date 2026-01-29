import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User, JwtPayload } from '../models/auth.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly API_URL = 'http://localhost:8080';
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        this.loadUserFromToken();
    }

    private loadUserFromToken(): void {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const user = this.decodeToken(token);
                this.currentUserSubject.next(user);
            } catch (e) {
                this.logout();
            }
        }
    }

    private decodeToken(token: string): User {
        // Decode JWT payload (base64)
        const payload = token.split('.')[1];
        const decoded: JwtPayload = JSON.parse(atob(payload));

        return {
            userId: decoded.userId,
            email: decoded.sub,
            role: decoded.role,
            status: decoded.status
        };
    }

    login(request: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, request).pipe(
            tap(response => {
                if (response.token) {
                    localStorage.setItem('token', response.token);
                    const user = this.decodeToken(response.token);
                    this.currentUserSubject.next(user);
                }
            })
        );
    }

    register(request: RegisterRequest): Observable<RegisterResponse> {
        return this.http.post<RegisterResponse>(`${this.API_URL}/auth/register`, request);
    }

    logout(): void {
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    getUser(): User | null {
        return this.currentUserSubject.value;
    }

    isLoggedIn(): boolean {
        const token = this.getToken();
        if (!token) return false;

        try {
            const payload = token.split('.')[1];
            const decoded: JwtPayload = JSON.parse(atob(payload));
            // Check if token is expired
            return decoded.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    }

    getUserRole(): string | null {
        const user = this.getUser();
        return user ? user.role : null;
    }

    getUserStatus(): string | null {
        const user = this.getUser();
        return user ? user.status : null;
    }

    getUserId(): number | null {
        const user = this.getUser();
        return user ? user.userId : null;
    }
}
