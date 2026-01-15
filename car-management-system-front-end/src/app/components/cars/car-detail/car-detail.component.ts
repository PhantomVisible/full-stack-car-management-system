import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CarService } from '../../../services/car.service';
import { RentalService } from '../../../services/rental.service';
import { AuthService } from '../../../services/auth.service';
import { CarResponse } from '../../../models/car.model';

@Component({
  selector: 'app-car-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="car-detail-page">
      <div class="container py-8">
        <!-- Loading State -->
        <div *ngIf="isLoading" class="loading-container">
          <div class="spinner"></div>
        </div>

        <!-- Error State -->
        <div *ngIf="error && !isLoading" class="error-container card">
          <div class="card-body text-center">
            <p>{{ error }}</p>
            <a routerLink="/cars" class="btn btn-primary mt-4">Back to Cars</a>
          </div>
        </div>

        <!-- Car Details -->
        <div *ngIf="car && !isLoading" class="car-detail-content">
          <a routerLink="/cars" class="back-link mb-6">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Cars
          </a>

          <div class="detail-grid">
            <!-- Left: Car Image & Gallery -->
            <div class="car-gallery">
              <div class="main-image card">
                <div class="image-placeholder">
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"/>
                    <circle cx="7" cy="17" r="2"/>
                    <circle cx="17" cy="17" r="2"/>
                  </svg>
                </div>
              </div>

              <div class="car-specs card mt-6">
                <div class="card-header">
                  <h3>Specifications</h3>
                </div>
                <div class="card-body">
                  <div class="specs-grid">
                    <div class="spec-item">
                      <span class="spec-label">Year</span>
                      <span class="spec-value">{{ car.year }}</span>
                    </div>
                    <div class="spec-item">
                      <span class="spec-label">Owner</span>
                      <span class="spec-value">{{ car.owner }}</span>
                    </div>
                    <div class="spec-item">
                      <span class="spec-label">Usage Count</span>
                      <span class="spec-value">{{ car.usageCount }} rentals</span>
                    </div>
                    <div class="spec-item">
                      <span class="spec-label">Score</span>
                      <span class="spec-value">{{ car.scoreCategory }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Car Info & Booking -->
            <div class="car-info">
              <div class="info-header">
                <div>
                  <span class="car-brand">{{ car.brand }}</span>
                  <h1 class="car-model">{{ car.model }}</h1>
                </div>
                <span class="badge" [class]="car.available ? 'badge-success' : 'badge-error'">
                  {{ car.available ? 'Available' : 'Currently Rented' }}
                </span>
              </div>

              <div class="price-display">
                <span class="price-amount">\${{ car.dailyPrice }}</span>
                <span class="price-period">per day</span>
              </div>

              <!-- Score Bar -->
              <div class="score-section">
                <div class="score-header">
                  <span>Quality Score</span>
                  <span class="score-value">{{ (car.score * 100).toFixed(0) }}%</span>
                </div>
                <div class="score-bar-large">
                  <div class="score-fill" [style.width.%]="car.score * 100"></div>
                </div>
              </div>

              <!-- Booking Form -->
              <div class="booking-section card" *ngIf="car.available">
                <div class="card-header">
                  <h3>Book This Car</h3>
                </div>
                <div class="card-body">
                  <div *ngIf="!isLoggedIn" class="login-prompt">
                    <p>Please log in to book this car</p>
                    <a routerLink="/login" [queryParams]="{returnUrl: '/cars/' + car.carId}" class="btn btn-primary">
                      Sign In to Book
                    </a>
                  </div>

                  <form *ngIf="isLoggedIn" (ngSubmit)="bookCar()">
                    <div class="form-group">
                      <label class="form-label">Start Date</label>
                      <input 
                        type="date" 
                        class="form-input"
                        [(ngModel)]="startDate"
                        name="startDate"
                        [min]="minDate"
                        required
                      />
                    </div>

                    <div class="form-group">
                      <label class="form-label">End Date</label>
                      <input 
                        type="date" 
                        class="form-input"
                        [(ngModel)]="endDate"
                        name="endDate"
                        [min]="startDate || minDate"
                        required
                      />
                    </div>

                    <div *ngIf="estimatedPrice" class="price-estimate">
                      <span class="estimate-label">Estimated Total:</span>
                      <span class="estimate-value">\${{ estimatedPrice.toFixed(2) }}</span>
                      <span class="estimate-days">({{ rentalDays }} days)</span>
                    </div>

                    <div *ngIf="bookingError" class="alert alert-error mt-4">
                      {{ bookingError }}
                    </div>

                    <div *ngIf="bookingSuccess" class="alert alert-success mt-4">
                      {{ bookingSuccess }}
                    </div>

                    <button 
                      type="submit" 
                      class="btn btn-accent btn-lg w-full mt-4"
                      [disabled]="isBooking || !startDate || !endDate"
                    >
                      <span *ngIf="isBooking" class="spinner spinner-sm"></span>
                      <span *ngIf="!isBooking">Confirm Booking</span>
                    </button>
                  </form>
                </div>
              </div>

              <div *ngIf="!car.available" class="unavailable-notice card">
                <div class="card-body text-center">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <p class="mt-4">This car is currently rented and unavailable for booking.</p>
                  <a routerLink="/cars" [queryParams]="{available: true}" class="btn btn-primary mt-4">
                    Browse Available Cars
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      justify-content: center;
      padding: var(--space-16);
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      color: var(--color-text);
      font-weight: 500;
      text-decoration: none;
    }

    .back-link:hover {
      color: var(--color-secondary);
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: var(--space-8);
    }

    @media (max-width: 1024px) {
      .detail-grid {
        grid-template-columns: 1fr;
      }
    }

    .main-image {
      aspect-ratio: 16 / 10;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
    }

    .image-placeholder {
      color: var(--color-text-light);
      opacity: 0.3;
    }

    .specs-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-4);
    }

    .spec-item {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .spec-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-text-light);
    }

    .spec-value {
      font-weight: 600;
      color: var(--color-text);
    }

    .info-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-4);
    }

    .car-brand {
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-secondary);
    }

    .car-model {
      font-size: 2rem;
      margin: 0;
    }

    .price-display {
      display: flex;
      align-items: baseline;
      gap: var(--space-2);
      margin-bottom: var(--space-6);
      padding-bottom: var(--space-6);
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }

    .price-amount {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--color-primary);
    }

    .price-period {
      font-size: 1rem;
      color: var(--color-text-light);
    }

    .score-section {
      margin-bottom: var(--space-6);
    }

    .score-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--space-2);
      font-size: 0.875rem;
    }

    .score-value {
      font-weight: 600;
      color: var(--color-secondary);
    }

    .score-bar-large {
      height: 8px;
      background: #e2e8f0;
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    .score-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--color-secondary) 0%, var(--color-accent) 100%);
      border-radius: var(--radius-full);
    }

    .login-prompt {
      text-align: center;
      padding: var(--space-4);
    }

    .login-prompt p {
      margin-bottom: var(--space-4);
      color: var(--color-text-light);
    }

    .price-estimate {
      display: flex;
      align-items: baseline;
      gap: var(--space-2);
      padding: var(--space-4);
      background: rgba(13, 148, 136, 0.1);
      border-radius: var(--radius-md);
    }

    .estimate-label {
      font-size: 0.875rem;
      color: var(--color-text-light);
    }

    .estimate-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-secondary);
    }

    .estimate-days {
      font-size: 0.875rem;
      color: var(--color-text-light);
    }

    .w-full {
      width: 100%;
    }

    .alert {
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-md);
    }

    .alert-error {
      background: rgba(239, 68, 68, 0.1);
      color: var(--color-error);
    }

    .alert-success {
      background: rgba(16, 185, 129, 0.1);
      color: var(--color-success);
    }

    .unavailable-notice {
      color: var(--color-text-light);
    }
  `]
})
export class CarDetailComponent implements OnInit {
  car: CarResponse | null = null;
  isLoading = true;
  error = '';
  isLoggedIn = false;

  startDate = '';
  endDate = '';
  minDate = '';

  isBooking = false;
  bookingError = '';
  bookingSuccess = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carService: CarService,
    private rentalService: RentalService,
    private authService: AuthService
  ) {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.setMinDate();
  }

  ngOnInit(): void {
    const carId = this.route.snapshot.params['id'];
    if (carId) {
      this.loadCar(+carId);
    }
  }

  private setMinDate(): void {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 60); // At least 1 hour from now
    this.minDate = now.toISOString().split('T')[0];
  }

  private loadCar(carId: number): void {
    this.isLoading = true;
    this.carService.getCarById(carId).subscribe({
      next: (car) => {
        this.car = car;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Car not found';
        this.isLoading = false;
      }
    });
  }

  get estimatedPrice(): number | null {
    if (!this.startDate || !this.endDate || !this.car) return null;
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    if (end <= start) return null;
    return this.rentalService.estimatePrice(this.car.dailyPrice, start, end);
  }

  get rentalDays(): number {
    if (!this.startDate || !this.endDate) return 0;
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    return this.rentalService.calculateDays(start, end);
  }

  bookCar(): void {
    if (!this.car || !this.startDate || !this.endDate) return;

    this.isBooking = true;
    this.bookingError = '';
    this.bookingSuccess = '';

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    this.rentalService.createRental(this.car.carId, start, end).subscribe({
      next: (rental) => {
        this.isBooking = false;
        this.bookingSuccess = 'Booking confirmed! Redirecting to your rentals...';
        setTimeout(() => {
          this.router.navigate(['/my-rentals']);
        }, 2000);
      },
      error: (err) => {
        this.isBooking = false;
        this.bookingError = err.error?.message || 'Booking failed. Please try again.';
      }
    });
  }
}
