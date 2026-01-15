import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="auth-page">
      <div class="auth-container animate-slideUp">
        <div class="auth-header">
          <div class="auth-logo">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"/>
              <circle cx="7" cy="17" r="2"/>
              <circle cx="17" cy="17" r="2"/>
            </svg>
          </div>
          <h1>Create Account</h1>
          <p class="text-muted">Join us and start renting cars today</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label class="form-label" for="email">Email Address</label>
            <input
              type="email"
              id="email"
              class="form-input"
              [(ngModel)]="email"
              name="email"
              placeholder="you@example.com"
              required
              [class.error]="emailError"
            />
            <span *ngIf="emailError" class="form-error">{{ emailError }}</span>
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <input
              type="password"
              id="password"
              class="form-input"
              [(ngModel)]="password"
              name="password"
              placeholder="At least 6 characters"
              required
              [class.error]="passwordError"
            />
            <span *ngIf="passwordError" class="form-error">{{ passwordError }}</span>
          </div>

          <div class="form-group">
            <label class="form-label" for="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              class="form-input"
              [(ngModel)]="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              required
              [class.error]="confirmPasswordError"
            />
            <span *ngIf="confirmPasswordError" class="form-error">{{ confirmPasswordError }}</span>
          </div>

          <div class="form-group">
            <label class="form-label">Account Type</label>
            <div class="role-selector">
              <label class="role-option" [class.active]="role === 'USER'">
                <input type="radio" name="role" value="USER" [(ngModel)]="role" />
                <div class="role-content">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span>Customer</span>
                </div>
              </label>
              <label class="role-option" [class.active]="role === 'ADMIN'">
                <input type="radio" name="role" value="ADMIN" [(ngModel)]="role" />
                <div class="role-content">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/>
                  </svg>
                  <span>Admin</span>
                </div>
              </label>
            </div>
          </div>

          <div *ngIf="serverError" class="alert alert-error">
            {{ serverError }}
          </div>

          <div *ngIf="successMessage" class="alert alert-success">
            {{ successMessage }}
          </div>

          <button type="submit" class="btn btn-primary btn-lg w-full" [disabled]="isLoading">
            <span *ngIf="isLoading" class="spinner spinner-sm"></span>
            <span *ngIf="!isLoading">Create Account</span>
          </button>
        </form>

        <div class="auth-footer">
          <p>
            Already have an account?
            <a routerLink="/login" class="auth-link">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 50%, var(--color-secondary-dark) 100%);
      padding: var(--space-4);
    }

    .auth-container {
      width: 100%;
      max-width: 420px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: var(--radius-2xl);
      padding: var(--space-10);
      box-shadow: var(--shadow-xl);
    }

    .auth-header {
      text-align: center;
      margin-bottom: var(--space-8);
    }

    .auth-logo {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
      border-radius: var(--radius-xl);
      color: white;
      margin-bottom: var(--space-4);
    }

    .auth-header h1 {
      font-size: 1.75rem;
      margin-bottom: var(--space-2);
    }

    .auth-form {
      margin-bottom: var(--space-6);
    }

    .w-full {
      width: 100%;
    }

    .role-selector {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-3);
    }

    .role-option {
      cursor: pointer;
    }

    .role-option input {
      display: none;
    }

    .role-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-4);
      border: 2px solid #e2e8f0;
      border-radius: var(--radius-lg);
      transition: all var(--transition-fast);
    }

    .role-option:hover .role-content {
      border-color: var(--color-secondary-light);
    }

    .role-option.active .role-content {
      border-color: var(--color-secondary);
      background: rgba(13, 148, 136, 0.05);
      color: var(--color-secondary);
    }

    .alert {
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-4);
    }

    .alert-error {
      background: rgba(239, 68, 68, 0.1);
      color: var(--color-error);
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .alert-success {
      background: rgba(16, 185, 129, 0.1);
      color: var(--color-success);
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .auth-footer {
      text-align: center;
      padding-top: var(--space-4);
      border-top: 1px solid rgba(0, 0, 0, 0.05);
    }

    .auth-link {
      font-weight: 600;
      color: var(--color-secondary);
    }

    .auth-link:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
    email = '';
    password = '';
    confirmPassword = '';
    role: 'USER' | 'ADMIN' = 'USER';
    isLoading = false;
    emailError = '';
    passwordError = '';
    confirmPasswordError = '';
    serverError = '';
    successMessage = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    onSubmit(): void {
        this.clearErrors();

        if (!this.validate()) {
            return;
        }

        this.isLoading = true;

        this.authService.register(this.email, this.password, this.role).subscribe({
            next: (response) => {
                this.isLoading = false;
                this.successMessage = 'Account created successfully! Redirecting to login...';
                setTimeout(() => {
                    this.router.navigate(['/login']);
                }, 2000);
            },
            error: (error) => {
                this.isLoading = false;
                this.serverError = error.error?.message || 'Registration failed. Please try again.';
            }
        });
    }

    private validate(): boolean {
        let isValid = true;

        if (!this.email) {
            this.emailError = 'Email is required';
            isValid = false;
        } else if (!this.isValidEmail(this.email)) {
            this.emailError = 'Please enter a valid email';
            isValid = false;
        }

        if (!this.password) {
            this.passwordError = 'Password is required';
            isValid = false;
        } else if (this.password.length < 6) {
            this.passwordError = 'Password must be at least 6 characters';
            isValid = false;
        }

        if (!this.confirmPassword) {
            this.confirmPasswordError = 'Please confirm your password';
            isValid = false;
        } else if (this.password !== this.confirmPassword) {
            this.confirmPasswordError = 'Passwords do not match';
            isValid = false;
        }

        return isValid;
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private clearErrors(): void {
        this.emailError = '';
        this.passwordError = '';
        this.confirmPasswordError = '';
        this.serverError = '';
        this.successMessage = '';
    }
}
