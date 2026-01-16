import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarService } from '../../services/car.service';
import { AuthService } from '../../services/auth.service';
import { CarStatistics, CarResponse } from '../../models/car.model';
import { UserResponse } from '../../models/auth.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-page">
      <div class="container py-8">
        <div class="page-header mb-8">
          <h1>Dashboard</h1>
          <p class="text-muted">Fleet statistics and insights</p>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="loading-container">
          <div class="spinner"></div>
          <p>Loading statistics...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="error && !isLoading" class="error-container card">
          <div class="card-body text-center">
            <p>{{ error }}</p>
            <button class="btn btn-primary mt-4" (click)="loadStatistics()">Try Again</button>
          </div>
        </div>

        <div *ngIf="!isLoading" class="dashboard-content">
          <!-- Statistics -->
          <div *ngIf="stats" class="stats-grid mb-8">
            <!-- (Existing stats cards kept same) -->
            <div class="stat-card card animate-slideUp">
              <div class="card-body">
                <div class="stat-icon total">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"/>
                    <circle cx="7" cy="17" r="2"/>
                    <circle cx="17" cy="17" r="2"/>
                  </svg>
                </div>
                <div class="stat-content">
                  <span class="stat-value">{{ stats.totalCars }}</span>
                  <span class="stat-label">Total Cars</span>
                </div>
              </div>
            </div>

            <div class="stat-card card animate-slideUp" style="animation-delay: 50ms">
              <div class="card-body">
                <div class="stat-icon available">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <div class="stat-content">
                  <span class="stat-value">{{ stats.availableCars }}</span>
                  <span class="stat-label">Available</span>
                </div>
              </div>
            </div>

            <div class="stat-card card animate-slideUp" style="animation-delay: 100ms">
              <div class="card-body">
                <div class="stat-icon rented">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div class="stat-content">
                  <span class="stat-value">{{ stats.totalCars - stats.availableCars }}</span>
                  <span class="stat-label">Rented</span>
                </div>
              </div>
            </div>

            <div class="stat-card card animate-slideUp" style="animation-delay: 150ms">
              <div class="card-body">
                <div class="stat-icon utilization">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                </div>
                <div class="stat-content">
                  <span class="stat-value">{{ getUtilizationRate() }}%</span>
                  <span class="stat-label">Utilization</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- My Fleet Section -->
          <div *ngIf="myCars.length > 0" class="card mb-8 animate-slideUp" style="animation-delay: 180ms">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h3>My Fleet</h3>
                <a routerLink="/cars/add" class="btn btn-sm btn-primary">Add New Car</a>
            </div>
            <div class="card-body">
                <div class="fleet-table-container">
                    <table class="fleet-table">
                        <thead>
                            <tr>
                                <th>Car</th>
                                <th>Year</th>
                                <th>Status</th>
                                <th>Price/Day</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="let car of myCars">
                                <td>
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="car-min-thumb">
                                            <img *ngIf="car.imageData" [src]="car.imageData" [alt]="car.brand" class="car-thumb-img" />
                                            <svg *ngIf="!car.imageData" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"/>
                                            </svg>
                                        </div>
                                        <span class="fw-bold">{{ car.brand }} {{ car.model }}</span>
                                    </div>
                                </td>
                                <td>{{ car.year }}</td>
                                <td>
                                    <span class="badge" [class]="car.available ? 'badge-success' : 'badge-error'">
                                        {{ car.available ? 'Available' : 'Rented' }}
                                    </span>
                                </td>
                                <td>\${{ car.dailyPrice }}</td>
                                <td>
                                    <div class="action-buttons">
                                        <a [routerLink]="['/cars/edit', car.carId]" class="btn-icon" title="Edit">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                        </a>
                                        <button (click)="deleteCar(car.carId!)" class="btn-icon danger" title="Delete">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
          </div>

          <div *ngIf="stats" class="dashboard-grid">
            <!-- Pricing Stats -->
            <div class="card animate-slideUp" style="animation-delay: 200ms">
              <div class="card-header">
                <h3>Pricing Overview</h3>
              </div>
              <div class="card-body">
                <div class="pricing-stats">
                  <div class="pricing-item">
                    <div class="pricing-bar">
                      <div class="bar-fill min" [style.height.%]="getPricePercent(stats.minDailyPrice)"></div>
                    </div>
                    <div class="pricing-info">
                      <span class="pricing-value">\${{ stats.minDailyPrice }}</span>
                      <span class="pricing-label">Min</span>
                    </div>
                  </div>
                  <div class="pricing-item">
                    <div class="pricing-bar">
                      <div class="bar-fill avg" [style.height.%]="getPricePercent(stats.averageDailyPrice)"></div>
                    </div>
                    <div class="pricing-info">
                      <span class="pricing-value">\${{ stats.averageDailyPrice | number:'1.0-0' }}</span>
                      <span class="pricing-label">Average</span>
                    </div>
                  </div>
                  <div class="pricing-item">
                    <div class="pricing-bar">
                      <div class="bar-fill max" [style.height.%]="100"></div>
                    </div>
                    <div class="pricing-info">
                      <span class="pricing-value">\${{ stats.maxDailyPrice }}</span>
                      <span class="pricing-label">Max</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Brand Distribution -->
            <div class="card animate-slideUp" style="animation-delay: 250ms">
              <div class="card-header">
                <h3>Brand Distribution</h3>
              </div>
              <div class="card-body">
                <div class="brand-list" *ngIf="stats.brandDistribution">
                  <div *ngFor="let brand of getBrandEntries()" class="brand-item">
                    <div class="brand-info">
                      <span class="brand-name">{{ brand.name }}</span>
                      <span class="brand-count">{{ brand.count }} cars</span>
                    </div>
                    <div class="brand-bar">
                      <div class="brand-fill" [style.width.%]="(brand.count / stats.totalCars) * 100"></div>
                    </div>
                  </div>
                </div>
                <p *ngIf="!stats.brandDistribution || getBrandEntries().length === 0" class="text-muted text-center">
                  No brand data available
                </p>
              </div>
            </div>

            <!-- Most Popular Car -->
            <div class="card animate-slideUp" style="animation-delay: 300ms" *ngIf="stats.mostPopularCar">
              <div class="card-header">
                <h3>Most Popular Car</h3>
              </div>
              <div class="card-body">
                <div class="popular-car">
                  <div class="car-image-placeholder">
                    <img *ngIf="stats.mostPopularCar.imageData" [src]="stats.mostPopularCar.imageData" [alt]="stats.mostPopularCar.brand + ' ' + stats.mostPopularCar.model" class="popular-car-img" />
                    <svg *ngIf="!stats.mostPopularCar.imageData" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"/>
                      <circle cx="7" cy="17" r="2"/>
                      <circle cx="17" cy="17" r="2"/>
                    </svg>
                  </div>
                  <div class="car-details">
                    <span class="car-brand">{{ stats.mostPopularCar.brand }}</span>
                    <span class="car-model">{{ stats.mostPopularCar.model }}</span>
                    <span class="car-usage">{{ stats.mostPopularCar.usageCount }} rentals</span>
                  </div>
                  <a [routerLink]="['/cars', stats.mostPopularCar.carId]" class="btn btn-secondary btn-sm">
                    View Details
                  </a>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="card animate-slideUp" style="animation-delay: 350ms">
              <div class="card-header">
                <h3>Quick Actions</h3>
              </div>
              <div class="card-body">
                <div class="quick-actions">
                  <a routerLink="/cars" class="action-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    Browse All Cars
                  </a>
                  <a routerLink="/cars" [queryParams]="{available: true}" class="action-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Available Cars
                  </a>
                  <a routerLink="/my-rentals" class="action-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    My Rentals
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
    .page-header h1 { font-size: 2rem; margin-bottom: var(--space-2); }
    .loading-container { text-align: center; padding: var(--space-16); color: var(--color-text-light); }
    .loading-container p { margin-top: var(--space-4); }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-4); }
    @media (max-width: 1024px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 640px) { .stats-grid { grid-template-columns: 1fr; } }
    .stat-card .card-body { display: flex; align-items: center; gap: var(--space-4); }
    .stat-icon { width: 48px; height: 48px; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; color: white; }
    .stat-icon.total { background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light)); }
    .stat-icon.available { background: linear-gradient(135deg, var(--color-success), #059669); }
    .stat-icon.rented { background: linear-gradient(135deg, var(--color-accent), var(--color-accent-light)); }
    .stat-icon.utilization { background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-light)); }
    .stat-content { display: flex; flex-direction: column; }
    .stat-value { font-size: 1.75rem; font-weight: 700; color: var(--color-text); line-height: 1; }
    .stat-label { font-size: 0.875rem; color: var(--color-text-light); margin-top: var(--space-1); }
    .dashboard-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-6); }
    @media (max-width: 768px) { .dashboard-grid { grid-template-columns: 1fr; } }
    .pricing-stats { display: flex; justify-content: space-around; align-items: flex-end; height: 150px; padding-top: var(--space-4); }
    .pricing-item { display: flex; flex-direction: column; align-items: center; gap: var(--space-2); }
    .pricing-bar { width: 40px; height: 100px; background: #e2e8f0; border-radius: var(--radius-md); display: flex; align-items: flex-end; overflow: hidden; }
    .bar-fill { width: 100%; border-radius: var(--radius-md); transition: height var(--transition-slow); }
    .bar-fill.min { background: var(--color-success); }
    .bar-fill.avg { background: var(--color-accent); }
    .bar-fill.max { background: var(--color-secondary); }
    .pricing-info { text-align: center; }
    .pricing-value { display: block; font-weight: 700; color: var(--color-text); }
    .pricing-label { font-size: 0.75rem; color: var(--color-text-light); }
    .brand-list { display: flex; flex-direction: column; gap: var(--space-3); }
    .brand-item { display: flex; flex-direction: column; gap: var(--space-1); }
    .brand-info { display: flex; justify-content: space-between; font-size: 0.875rem; }
    .brand-name { font-weight: 500; }
    .brand-count { color: var(--color-text-light); }
    .brand-bar { height: 8px; background: #e2e8f0; border-radius: var(--radius-full); overflow: hidden; }
    .brand-fill { height: 100%; background: linear-gradient(90deg, var(--color-secondary), var(--color-secondary-light)); border-radius: var(--radius-full); }
    .popular-car { display: flex; align-items: center; gap: var(--space-4); }
    .car-image-placeholder { width: 80px; height: 80px; background: linear-gradient(135deg, #e2e8f0, #cbd5e1); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; color: var(--color-text-light); overflow: hidden; }
    .popular-car-img { width: 100%; height: 100%; object-fit: cover; }
    .car-details { flex: 1; display: flex; flex-direction: column; }
    .car-brand { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: var(--color-secondary); }
    .car-model { font-size: 1.125rem; font-weight: 700; color: var(--color-primary); }
    .car-usage { font-size: 0.875rem; color: var(--color-text-light); }
    .quick-actions { display: flex; flex-direction: column; gap: var(--space-2); }
    .action-btn { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3) var(--space-4); border-radius: var(--radius-md); text-decoration: none; color: var(--color-text); font-weight: 500; transition: all var(--transition-fast); }
    .action-btn:hover { background: rgba(13, 148, 136, 0.1); color: var(--color-secondary); }
    
    /* Fleet Table Styles */
    .fleet-table-container { overflow-x: auto; }
    .fleet-table { width: 100%; border-collapse: separate; border-spacing: 0; }
    .fleet-table th { text-align: left; padding: var(--space-3) var(--space-4); color: var(--color-text-light); font-weight: 500; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; }
    .fleet-table td { padding: var(--space-3) var(--space-4); vertical-align: middle; border-bottom: 1px solid #f1f5f9; }
    .fleet-table tr:last-child td { border-bottom: none; }
    .car-min-thumb { width: 32px; height: 32px; background: #f1f5f9; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--color-text-light); overflow: hidden; }
    .car-thumb-img { width: 100%; height: 100%; object-fit: cover; }
    .action-buttons { display: flex; gap: var(--space-2); }
    .btn-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md); background: #f1f5f9; color: var(--color-text-light); border: none; cursor: pointer; transition: all 0.2s; }
    .btn-icon:hover { background: var(--color-secondary); color: white; }
    .btn-icon.danger:hover { background: var(--color-error); color: white; }
    .d-flex { display: flex; }
    .justify-content-between { justify-content: space-between; }
    .align-items-center { align-items: center; }
    .gap-2 { gap: var(--space-2); }
    .fw-bold { font-weight: 600; }
    `]
})
export class DashboardComponent implements OnInit {
  stats: CarStatistics | null = null;
  isLoading = true;
  error = '';

  myCars: CarResponse[] = [];
  currentUserEmail: string = '';

  constructor(
    private carService: CarService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadStatistics();

    // Fetch current user to get email for filtering cars
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUserEmail = user.email;
        this.loadMyCars();
      },
      error: () => {
        // Ignore error if user fetch fails, just won't show my cars
      }
    });
  }

  loadStatistics(): void {
    this.isLoading = true;
    this.error = '';

    this.carService.getStatistics().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load statistics. Please try again.';
        this.isLoading = false;
      }
    });
  }

  loadMyCars(): void {
    this.carService.getAllCars().subscribe({
      next: (cars) => {
        // Filter cars where owner matches current user email
        // Note: This relies on 'owner' field in Car matching the user's email or identifier
        // Since we set owner to 'CarRent Fleet' default in form, we might need adjustments 
        // if we want strict filtering. But assuming admin sets owner to their name/email:

        // If the user entered their email as owner, this works. 
        // If they entered "CarRent Fleet", we might want to show those too if I am admin.
        // For now, let's show ALL cars if I am admin, or filter?
        // The requirement: "dashboard for admin should show the car they have listed... easier for them to remove"

        // If I am THE admin, I probably want to see ALL cars to manage the fleet.
        // Or if we have multiple admins, maybe only mine?
        // "show the car they have listed" implies ownership.
        // But usually admins manage the whole fleet.
        // Let's filter by owner matching email OR if owner is "CarRent Fleet" (default).

        if (this.currentUserEmail) {
          this.myCars = cars.filter(c =>
            c.owner === this.currentUserEmail ||
            c.owner === 'CarRent Fleet' ||
            (this.authService.isAdmin()) // If admin, show all? Maybe just show list.
          );

          // Actually, if I am admin, I should probably see everything. 
          // Let's just show all cars for now in "My Fleet" since it's an admin dashboard.
          this.myCars = cars;
        }
      }
    });
  }

  deleteCar(carId: number): void {
    if (confirm('Are you sure you want to delete this car?')) {
      this.carService.deleteCar(carId).subscribe({
        next: () => {
          // Remove from list
          this.myCars = this.myCars.filter(c => c.carId !== carId);
          // Reload stats
          this.loadStatistics();
        },
        error: (err) => {
          alert('Failed to delete car. It might be currently rented.');
        }
      });
    }
  }

  getUtilizationRate(): string {
    if (!this.stats || this.stats.totalCars === 0) return '0';
    const rate = ((this.stats.totalCars - this.stats.availableCars) / this.stats.totalCars) * 100;
    return rate.toFixed(0);
  }

  getPricePercent(price: number): number {
    if (!this.stats || this.stats.maxDailyPrice === 0) return 0;
    return (price / this.stats.maxDailyPrice) * 100;
  }

  getBrandEntries(): { name: string; count: number }[] {
    if (!this.stats?.brandDistribution) return [];
    return Object.entries(this.stats.brandDistribution)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }
}
