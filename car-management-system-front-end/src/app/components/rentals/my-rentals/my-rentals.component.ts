import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RentalService } from '../../../services/rental.service';
import { CarService } from '../../../services/car.service';
import { RentalResponse } from '../../../models/rental.model';
import { CarResponse } from '../../../models/car.model';

@Component({
    selector: 'app-my-rentals',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="my-rentals-page">
      <div class="container py-8">
        <div class="page-header mb-8">
          <h1>My Rentals</h1>
          <p class="text-muted">View and manage your car rentals</p>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="loading-container">
          <div class="spinner"></div>
          <p>Loading your rentals...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="error && !isLoading" class="error-container card">
          <div class="card-body text-center">
            <p>{{ error }}</p>
            <button class="btn btn-primary mt-4" (click)="loadRentals()">Try Again</button>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!isLoading && !error && rentals.length === 0" class="empty-state card">
          <div class="card-body text-center py-16">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-icon">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <h3 class="mt-4">No Rentals Yet</h3>
            <p class="text-muted">Start by browsing our available cars</p>
            <a routerLink="/cars" class="btn btn-primary mt-4">Browse Cars</a>
          </div>
        </div>

        <!-- Rentals List -->
        <div *ngIf="!isLoading && !error && rentals.length > 0" class="rentals-list">
          <div *ngFor="let rental of rentals" class="rental-card card mb-4 animate-slideUp">
            <div class="card-body">
              <div class="rental-header">
                <div class="rental-info">
                  <div class="rental-car">
                    <span class="car-name" *ngIf="getCarInfo(rental.carId) as car">
                      {{ car.brand }} {{ car.model }}
                    </span>
                    <span class="car-name" *ngIf="!getCarInfo(rental.carId)">
                      Car #{{ rental.carId }}
                    </span>
                  </div>
                  <span class="rental-id">Rental #{{ rental.rentalId }}</span>
                </div>
                <span class="badge" [ngClass]="getStatusBadgeClass(rental.status)">
                  {{ rental.status }}
                </span>
              </div>

              <div class="rental-dates">
                <div class="date-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <div>
                    <span class="date-label">Start Date</span>
                    <span class="date-value">{{ formatDate(rental.startDate) }}</span>
                  </div>
                </div>
                <div class="date-arrow">→</div>
                <div class="date-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <div>
                    <span class="date-label">End Date</span>
                    <span class="date-value">{{ formatDate(rental.endDate) }}</span>
                  </div>
                </div>
              </div>

              <div class="rental-footer">
                <div class="rental-pricing">
                  <div class="price-item">
                    <span class="price-label">Total</span>
                    <span class="price-value">\${{ rental.totalPrice }}</span>
                  </div>
                  <div class="price-item" *ngIf="rental.latePenalty > 0">
                    <span class="price-label penalty">Late Fee</span>
                    <span class="price-value penalty">\${{ rental.latePenalty }}</span>
                  </div>
                </div>

                <div class="rental-actions">
                  <button 
                    *ngIf="rental.status === 'ACTIVE'"
                    class="btn btn-secondary"
                    (click)="returnCar(rental)"
                    [disabled]="returningId === rental.rentalId"
                  >
                    <span *ngIf="returningId === rental.rentalId" class="spinner spinner-sm"></span>
                    <span *ngIf="returningId !== rental.rentalId">Return Car</span>
                  </button>
                  <a [routerLink]="['/cars', rental.carId]" class="btn btn-ghost">View Car</a>
                </div>
              </div>

              <div *ngIf="rental.actualReturnDate" class="return-info">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                Returned on {{ formatDate(rental.actualReturnDate) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .page-header h1 {
      font-size: 2rem;
      margin-bottom: var(--space-2);
    }

    .loading-container,
    .empty-state {
      text-align: center;
    }

    .loading-container {
      padding: var(--space-16);
      color: var(--color-text-light);
    }

    .loading-container p {
      margin-top: var(--space-4);
    }

    .empty-icon {
      color: var(--color-text-light);
      margin: 0 auto;
    }

    .rental-card {
      transition: transform var(--transition-base), box-shadow var(--transition-base);
    }

    .rental-card:hover {
      transform: translateY(-2px);
    }

    .rental-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-4);
    }

    .car-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-primary);
      display: block;
    }

    .rental-id {
      font-size: 0.875rem;
      color: var(--color-text-light);
    }

    .rental-dates {
      display: flex;
      align-items: center;
      gap: var(--space-6);
      padding: var(--space-4);
      background: rgba(0, 0, 0, 0.02);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-4);
    }

    .date-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .date-label {
      display: block;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-text-light);
    }

    .date-value {
      font-weight: 600;
    }

    .date-arrow {
      color: var(--color-text-light);
      font-size: 1.25rem;
    }

    .rental-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .rental-pricing {
      display: flex;
      gap: var(--space-6);
    }

    .price-item {
      display: flex;
      flex-direction: column;
    }

    .price-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      color: var(--color-text-light);
    }

    .price-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-primary);
    }

    .price-label.penalty,
    .price-value.penalty {
      color: var(--color-error);
    }

    .rental-actions {
      display: flex;
      gap: var(--space-2);
    }

    .return-info {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin-top: var(--space-4);
      padding-top: var(--space-4);
      border-top: 1px solid rgba(0, 0, 0, 0.05);
      font-size: 0.875rem;
      color: var(--color-success);
    }

    @media (max-width: 768px) {
      .rental-dates {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-3);
      }

      .date-arrow {
        display: none;
      }

      .rental-footer {
        flex-direction: column;
        gap: var(--space-4);
        align-items: flex-start;
      }

      .rental-actions {
        width: 100%;
      }

      .rental-actions .btn {
        flex: 1;
      }
    }
  `]
})
export class MyRentalsComponent implements OnInit {
    rentals: RentalResponse[] = [];
    cars: Map<number, CarResponse> = new Map();
    isLoading = true;
    error = '';
    returningId: number | null = null;

    constructor(
        private rentalService: RentalService,
        private carService: CarService
    ) { }

    ngOnInit(): void {
        this.loadRentals();
    }

    loadRentals(): void {
        this.isLoading = true;
        this.error = '';

        this.rentalService.getMyRentals().subscribe({
            next: (rentals) => {
                this.rentals = rentals;
                this.loadCarDetails(rentals);
                this.isLoading = false;
            },
            error: (err) => {
                this.error = 'Failed to load your rentals. Please try again.';
                this.isLoading = false;
            }
        });
    }

    private loadCarDetails(rentals: RentalResponse[]): void {
        const carIds = [...new Set(rentals.map(r => r.carId))];
        carIds.forEach(carId => {
            this.carService.getCarById(carId).subscribe({
                next: (car) => this.cars.set(carId, car),
                error: () => { } // Ignore errors for individual cars
            });
        });
    }

    getCarInfo(carId: number): CarResponse | undefined {
        return this.cars.get(carId);
    }

    getStatusBadgeClass(status: string): string {
        switch (status) {
            case 'ACTIVE': return 'badge-info';
            case 'RETURNED': return 'badge-success';
            case 'OVERDUE': return 'badge-error';
            case 'CANCELLED': return 'badge-warning';
            default: return 'badge-primary';
        }
    }

    formatDate(dateString: string): string {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    returnCar(rental: RentalResponse): void {
        this.returningId = rental.rentalId;

        this.rentalService.returnCar(rental.rentalId).subscribe({
            next: (updatedRental) => {
                const index = this.rentals.findIndex(r => r.rentalId === rental.rentalId);
                if (index > -1) {
                    this.rentals[index] = updatedRental;
                }
                this.returningId = null;
            },
            error: (err) => {
                this.returningId = null;
                alert('Failed to return car. Please try again.');
            }
        });
    }
}
