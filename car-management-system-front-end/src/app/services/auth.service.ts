import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { AuthResponse, RegisterRequest, UserResponse } from '../models/auth.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly API_URL = '/api/auth';
    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'current_user';
    private readonly ROLE_KEY = 'user_role';

    private currentUserSubject = new BehaviorSubject<UserResponse | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    private isLoggedInSubject = new BehaviorSubject<boolean>(false);
    public isLoggedIn$ = this.isLoggedInSubject.asObservable();

    private userRoleSubject = new BehaviorSubject<string | null>(null);
    public userRole$ = this.userRoleSubject.asObservable();

    private isBrowser: boolean;

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
        this.checkAuthStatus();
    }

    register(email: string, password: string, role: 'USER' | 'ADMIN' = 'USER'): Observable<AuthResponse> {
        const request: RegisterRequest = { email, password, role };
        return this.http.post<AuthResponse>(`${this.API_URL}/register`, request);
    }

    login(email: string, password: string): Observable<AuthResponse> {
        const request = { email, password };
        return this.http.post<AuthResponse>(`${this.API_URL}/login`, request).pipe(
            tap(response => {
                if (response.token) {
                    this.setToken(response.token);
                    this.setRole(response.role);
                    this.isLoggedInSubject.next(true);
                    this.userRoleSubject.next(response.role);
                }
            })
        );
    }

    logout(): void {
        if (this.isBrowser) {
            localStorage.removeItem(this.TOKEN_KEY);
            localStorage.removeItem(this.USER_KEY);
            localStorage.removeItem(this.ROLE_KEY);
        }
        this.currentUserSubject.next(null);
        this.isLoggedInSubject.next(false);
        this.userRoleSubject.next(null);
    }

    getCurrentUser(): Observable<UserResponse> {
        return this.http.get<UserResponse>(`${this.API_URL}/me`).pipe(
            tap(user => {
                this.currentUserSubject.next(user);
                if (this.isBrowser) {
                    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
                }
            })
        );
    }

    getToken(): string | null {
        if (!this.isBrowser) return null;
        return localStorage.getItem(this.TOKEN_KEY);
    }

    getRole(): string | null {
        if (!this.isBrowser) return null;
        return localStorage.getItem(this.ROLE_KEY);
    }

    isAdmin(): boolean {
        return this.getRole() === 'ADMIN';
    }

    private setToken(token: string): void {
        if (this.isBrowser) {
            localStorage.setItem(this.TOKEN_KEY, token);
        }
    }

    private setRole(role: string): void {
        if (this.isBrowser) {
            localStorage.setItem(this.ROLE_KEY, role);
            this.userRoleSubject.next(role);
        }
    }

    private checkAuthStatus(): void {
        const token = this.getToken();
        if (token) {
            this.isLoggedInSubject.next(true);
            const savedUser = this.isBrowser ? localStorage.getItem(this.USER_KEY) : null;
            if (savedUser) {
                this.currentUserSubject.next(JSON.parse(savedUser));
            }
            const savedRole = this.getRole();
            if (savedRole) {
                this.userRoleSubject.next(savedRole);
            }
        }
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}

