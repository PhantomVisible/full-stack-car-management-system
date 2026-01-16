import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <a routerLink="/" class="navbar-brand">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"/>
            <circle cx="7" cy="17" r="2"/>
            <circle cx="17" cy="17" r="2"/>
          </svg>
          <span>CarRent</span>
        </a>

        <button class="menu-toggle" (click)="toggleMenu()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <ul class="navbar-nav" [class.open]="menuOpen">
          <li>
            <a routerLink="/cars" routerLinkActive="active" class="navbar-link">Browse Cars</a>
          </li>
          <li>
            <a routerLink="/dashboard" routerLinkActive="active" class="navbar-link">Dashboard</a>
          </li>

          <ng-container *ngIf="isLoggedIn$ | async; else guestLinks">
            <li *ngIf="isAdmin">
              <a routerLink="/cars/add" routerLinkActive="active" class="navbar-link admin-link">
                Add Car
              </a>
            </li>
            <li>
              <a routerLink="/my-rentals" routerLinkActive="active" class="navbar-link">My Rentals</a>
            </li>
            <li>
              <button class="btn btn-outline btn-sm" (click)="logout()">Sign Out</button>
            </li>
          </ng-container>

          <ng-template #guestLinks>
            <li>
              <a routerLink="/login" class="btn btn-ghost btn-sm">Sign In</a>
            </li>
            <li>
              <a routerLink="/register" class="btn btn-primary btn-sm">Get Started</a>
            </li>
          </ng-template>
        </ul>
      </div>
    </nav>
  `,
  styles: [`
    .menu-toggle {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: var(--space-2);
      color: var(--color-text);
    }

    @media (max-width: 768px) {
      .menu-toggle {
        display: block;
      }

      .navbar-nav {
        display: none;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        padding: var(--space-4);
        box-shadow: var(--shadow-lg);
        gap: var(--space-4);
      }

      .navbar-nav.open {
        display: flex;
      }

      .navbar-nav li {
        width: 100%;
      }

      .navbar-nav .btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class NavbarComponent {
  menuOpen = false;
  isLoggedIn$;

  constructor(private authService: AuthService) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.menuOpen = false;
  }
}

