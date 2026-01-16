import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarResponse } from '../../../models/car.model';

@Component({
  selector: 'app-car-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="car-card card" [routerLink]="['/cars', car.carId]">
      <div class="car-image">
        <img *ngIf="car.imageData" [src]="car.imageData" [alt]="car.brand + ' ' + car.model" class="car-img" />
        <div *ngIf="!car.imageData" class="car-placeholder">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"/>
            <circle cx="7" cy="17" r="2"/>
            <circle cx="17" cy="17" r="2"/>
          </svg>
        </div>
        
        <div class="car-badges">
          <span class="badge" [class]="car.available ? 'badge-success' : 'badge-error'">
            {{ car.available ? 'Available' : 'Rented' }}
          </span>
          <span class="badge badge-primary" *ngIf="car.scoreCategory">
            {{ car.scoreCategory }}
          </span>
        </div>
      </div>

      <div class="car-body">
        <div class="car-brand">{{ car.brand }}</div>
        <div class="car-model">{{ car.model }}</div>
        
        <div class="car-details">
          <div class="car-detail">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {{ car.year }}
          </div>
          <div class="car-detail">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            {{ car.owner }}
          </div>
        </div>

        <div class="car-footer">
          <div class="car-price">
            <span class="price-amount">\${{ car.dailyPrice }}</span>
            <span class="price-period">/day</span>
          </div>
          
          <div class="car-score" *ngIf="car.score !== undefined">
            <div class="score-bar">
              <div class="score-fill" [style.width.%]="car.score * 100"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .car-card {
      cursor: pointer;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .car-image {
      position: relative;
      background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
      padding: var(--space-8);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 140px;
    }

    .car-img {
      width: 100%;
      height: 140px;
      object-fit: cover;
      position: absolute;
      top: 0;
      left: 0;
    }

    .car-placeholder {
      color: var(--color-text-light);
      opacity: 0.5;
    }

    .car-badges {
      position: absolute;
      top: var(--space-3);
      left: var(--space-3);
      display: flex;
      gap: var(--space-2);
    }

    .car-body {
      padding: var(--space-5);
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .car-brand {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-secondary);
      margin-bottom: var(--space-1);
    }

    .car-model {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-primary);
      margin-bottom: var(--space-3);
    }

    .car-details {
      display: flex;
      gap: var(--space-4);
      margin-bottom: var(--space-4);
    }

    .car-detail {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      font-size: 0.875rem;
      color: var(--color-text-light);
    }

    .car-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
      padding-top: var(--space-4);
      border-top: 1px solid rgba(0, 0, 0, 0.05);
    }

    .car-price {
      display: flex;
      align-items: baseline;
      gap: var(--space-1);
    }

    .price-amount {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-primary);
    }

    .price-period {
      font-size: 0.875rem;
      color: var(--color-text-light);
    }

    .car-score {
      width: 60px;
    }

    .score-bar {
      height: 6px;
      background: #e2e8f0;
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    .score-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--color-secondary) 0%, var(--color-accent) 100%);
      border-radius: var(--radius-full);
      transition: width var(--transition-slow);
    }
  `]
})
export class CarCardComponent {
  @Input() car!: CarResponse;
}
