import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CarService } from '../../../services/car.service';
import { CarResponse } from '../../../models/car.model';
import { CarCardComponent } from '../car-card/car-card.component';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CarCardComponent],
  template: `
    <div class="car-list-page">
      <div class="container py-8">
        <!-- Header -->
        <div class="page-header mb-8">
          <h1>Browse Cars</h1>
          <p class="text-muted">Find the perfect car for your next adventure</p>
        </div>

        <!-- Filters -->
        <div class="filters-section card mb-8">
          <div class="card-body">
            <div class="filters-grid">
              <div class="form-group m-0">
                <label class="form-label">Brand</label>
                <input 
                  type="text" 
                  class="form-input" 
                  [(ngModel)]="filters.brand"
                  placeholder="e.g. Toyota"
                  (input)="onFilterChange()"
                />
              </div>

              <div class="form-group m-0">
                <label class="form-label">Model</label>
                <input 
                  type="text" 
                  class="form-input" 
                  [(ngModel)]="filters.model"
                  placeholder="e.g. Camry"
                  (input)="onFilterChange()"
                />
              </div>

              <div class="form-group m-0">
                <label class="form-label">Min Year</label>
                <input 
                  type="number" 
                  class="form-input" 
                  [(ngModel)]="filters.minYear"
                  placeholder="2015"
                  (input)="onFilterChange()"
                />
              </div>

              <div class="form-group m-0">
                <label class="form-label">Max Year</label>
                <input 
                  type="number" 
                  class="form-input" 
                  [(ngModel)]="filters.maxYear"
                  placeholder="2024"
                  (input)="onFilterChange()"
                />
              </div>

              <div class="form-group m-0">
                <label class="form-label">Availability</label>
                <select class="form-select form-input" [(ngModel)]="availabilityFilter" (change)="onFilterChange()">
                  <option value="all">All Cars</option>
                  <option value="available">Available Only</option>
                  <option value="rented">Rented Only</option>
                </select>
              </div>

              <div class="filter-actions">
                <button class="btn btn-secondary" (click)="applyFilters()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  Search
                </button>
                <button class="btn btn-ghost" (click)="clearFilters()">Clear</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Filters -->
        <div class="quick-filters mb-6">
          <button 
            class="quick-filter" 
            [class.active]="activeQuickFilter === 'all'"
            (click)="loadAllCars()"
          >
            All Cars
          </button>
          <button 
            class="quick-filter" 
            [class.active]="activeQuickFilter === 'available'"
            (click)="loadAvailableCars()"
          >
            Available
          </button>
          <button 
            class="quick-filter" 
            [class.active]="activeQuickFilter === 'recommended'"
            (click)="loadRecommendedCars()"
          >
            Recommended
          </button>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="loading-container">
          <div class="spinner"></div>
          <p>Loading cars...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="error" class="error-container card">
          <div class="card-body text-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="error-icon">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p class="mt-4">{{ error }}</p>
            <button class="btn btn-primary mt-4" (click)="loadAllCars()">Try Again</button>
          </div>
        </div>

        <!-- Cars Grid -->
        <div *ngIf="!isLoading && !error" class="cars-grid">
          <app-car-card 
            *ngFor="let car of cars" 
            [car]="car"
            class="animate-slideUp"
          ></app-car-card>
        </div>

        <!-- Empty State -->
        <div *ngIf="!isLoading && !error && cars.length === 0" class="empty-state card">
          <div class="card-body text-center">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-icon">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"/>
              <circle cx="7" cy="17" r="2"/>
              <circle cx="17" cy="17" r="2"/>
            </svg>
            <h3 class="mt-4">No Cars Found</h3>
            <p class="text-muted">Try adjusting your search filters</p>
            <button class="btn btn-primary mt-4" (click)="clearFilters()">Clear Filters</button>
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

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr) auto;
      gap: var(--space-4);
      align-items: end;
    }

    @media (max-width: 1024px) {
      .filters-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 640px) {
      .filters-grid {
        grid-template-columns: 1fr;
      }
    }

    .filter-actions {
      display: flex;
      gap: var(--space-2);
    }

    .quick-filters {
      display: flex;
      gap: var(--space-2);
      flex-wrap: wrap;
    }

    .quick-filter {
      padding: var(--space-2) var(--space-4);
      background: transparent;
      border: 2px solid #e2e8f0;
      border-radius: var(--radius-full);
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .quick-filter:hover {
      border-color: var(--color-secondary);
      color: var(--color-secondary);
    }

    .quick-filter.active {
      background: var(--color-secondary);
      border-color: var(--color-secondary);
      color: white;
    }

    .cars-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-6);
    }

    @media (max-width: 1024px) {
      .cars-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .cars-grid {
        grid-template-columns: 1fr;
      }
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-16);
      color: var(--color-text-light);
    }

    .loading-container p {
      margin-top: var(--space-4);
    }

    .error-container,
    .empty-state {
      max-width: 400px;
      margin: var(--space-8) auto;
    }

    .error-icon,
    .empty-icon {
      color: var(--color-text-light);
      margin: 0 auto;
    }
  `]
})
export class CarListComponent implements OnInit {
  cars: CarResponse[] = [];
  isLoading = false;
  error = '';
  activeQuickFilter = 'all';
  availabilityFilter = 'all';

  filters = {
    brand: '',
    model: '',
    minYear: null as number | null,
    maxYear: null as number | null
  };

  private filterTimeout: any;

  constructor(private carService: CarService) { }

  ngOnInit(): void {
    this.loadAllCars();
  }

  loadAllCars(): void {
    this.activeQuickFilter = 'all';
    this.isLoading = true;
    this.error = '';

    this.carService.getAllCars().subscribe({
      next: (cars) => {
        this.cars = cars;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load cars. Please try again.';
        this.isLoading = false;
      }
    });
  }

  loadAvailableCars(): void {
    this.activeQuickFilter = 'available';
    this.isLoading = true;
    this.error = '';

    this.carService.getAvailableCars().subscribe({
      next: (cars) => {
        this.cars = cars;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load cars. Please try again.';
        this.isLoading = false;
      }
    });
  }

  loadRecommendedCars(): void {
    this.activeQuickFilter = 'recommended';
    this.isLoading = true;
    this.error = '';

    this.carService.getRecommendedCars().subscribe({
      next: (cars) => {
        this.cars = cars;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load cars. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onFilterChange(): void {
    clearTimeout(this.filterTimeout);
    this.filterTimeout = setTimeout(() => {
      this.applyFilters();
    }, 500);
  }

  applyFilters(): void {
    this.activeQuickFilter = '';
    this.isLoading = true;
    this.error = '';

    const params: any = {};
    if (this.filters.brand) params.brand = this.filters.brand;
    if (this.filters.model) params.model = this.filters.model;
    if (this.filters.minYear) params.minYear = this.filters.minYear;
    if (this.filters.maxYear) params.maxYear = this.filters.maxYear;
    if (this.availabilityFilter === 'available') params.available = true;
    if (this.availabilityFilter === 'rented') params.available = false;

    this.carService.searchCars(params).subscribe({
      next: (cars) => {
        this.cars = cars;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to search cars. Please try again.';
        this.isLoading = false;
      }
    });
  }

  clearFilters(): void {
    this.filters = {
      brand: '',
      model: '',
      minYear: null,
      maxYear: null
    };
    this.availabilityFilter = 'all';
    this.loadAllCars();
  }
}
