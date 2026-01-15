import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-login',
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
          <h1>Welcome Back</h1>
          <p class="text-muted">Sign in to your account to continue</p>
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
              placeholder="••••••••"
              required
              [class.error]="passwordError"
            />
            <span *ngIf="passwordError" class="form-error">{{ passwordError }}</span>
          </div>

          <div *ngIf="serverError" class="alert alert-error">
            {{ serverError }}
          </div>

          <button type="submit" class="btn btn-primary btn-lg w-full" [disabled]="isLoading">
            <span *ngIf="isLoading" class="spinner spinner-sm"></span>
            <span *ngIf="!isLoading">Sign In</span>
          </button>
        </form>

        <div class="auth-footer">
          <p>
            Don't have an account?
            <a routerLink="/register" class="auth-link">Create one</a>
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
export class LoginComponent {
    email = '';
    password = '';
    isLoading = false;
    emailError = '';
    passwordError = '';
    serverError = '';
    returnUrl = '/';

    constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    onSubmit(): void {
        this.clearErrors();

        if (!this.validate()) {
            return;
        }

        this.isLoading = true;

        this.authService.login(this.email, this.password).subscribe({
            next: (response) => {
                this.isLoading = false;
                this.router.navigateByUrl(this.returnUrl);
            },
            error: (error) => {
                this.isLoading = false;
                this.serverError = error.error?.message || 'Invalid email or password';
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
        this.serverError = '';
    }
}
