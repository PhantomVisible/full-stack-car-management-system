import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CarService } from '../../../services/car.service';
import { AuthService } from '../../../services/auth.service';
import { CarRequest } from '../../../models/car.model';

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="form-page">
      <div class="form-container animate-slideUp">
        <div class="form-header">
          <h1>{{ isEditMode ? 'Edit Car' : 'Add New Car' }}</h1>
          <p class="text-muted">{{ isEditMode ? 'Update vehicle details' : 'Add a new vehicle to the rental fleet' }}</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="car-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="brand">Brand *</label>
              <input
                type="text"
                id="brand"
                class="form-input"
                [(ngModel)]="car.brand"
                name="brand"
                placeholder="e.g. Tesla, BMW, Mercedes"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label" for="model">Model *</label>
              <input
                type="text"
                id="model"
                class="form-input"
                [(ngModel)]="car.model"
                name="model"
                placeholder="e.g. Model S, X5, E-Class"
                required
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="year">Year *</label>
              <input
                type="number"
                id="year"
                class="form-input"
                [(ngModel)]="car.year"
                name="year"
                placeholder="2024"
                min="1990"
                max="2030"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label" for="dailyPrice">Daily Price ($) *</label>
              <input
                type="number"
                id="dailyPrice"
                class="form-input"
                [(ngModel)]="car.dailyPrice"
                name="dailyPrice"
                placeholder="100.00"
                min="1"
                step="0.01"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="owner">Owner / Fleet Name</label>
            <input
              type="text"
              id="owner"
              class="form-input"
              [(ngModel)]="car.owner"
              name="owner"
              placeholder="e.g. CarRent Fleet"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Car Image (Optional)</label>
            <div class="image-upload-section">
              <input
                type="file"
                id="carImage"
                accept="image/jpeg,image/png,image/webp"
                (change)="onImageSelected($event)"
                class="file-input"
              />
              <label for="carImage" class="file-label">
                <span class="icon">📷</span>
                <span>{{ imagePreview ? 'Change Image' : 'Choose Image' }}</span>
              </label>
              <div *ngIf="imagePreview" class="image-preview-container">
                <img [src]="imagePreview" alt="Car preview" class="image-preview" />
                <button type="button" class="remove-image-btn" (click)="removeImage()">✕</button>
              </div>
              <p class="image-help-text">Max size: 5MB. Formats: JPEG, PNG, WebP</p>
            </div>
          </div>
          
          <div *ngIf="isEditMode" class="form-group">
             <label class="form-label">Availability</label>
             <div class="checkbox-group">
                 <input type="checkbox" id="available" [(ngModel)]="carAvailable" name="available">
                 <label for="available">Available for Rent</label>
             </div>
          </div>

          <div *ngIf="successMessage" class="alert alert-success">
            {{ successMessage }}
          </div>

          <div *ngIf="errorMessage" class="alert alert-error">
            {{ errorMessage }}
          </div>

          <div class="form-actions">
            <a routerLink="/dashboard" class="btn btn-ghost">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="isLoading">
              <span *ngIf="isLoading" class="spinner spinner-sm"></span>
              <span *ngIf="!isLoading">{{ isEditMode ? 'Update Car' : 'Add Car' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-page {
      min-height: 100vh;
      padding: var(--space-8) var(--space-4);
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    }

    .form-container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: var(--radius-2xl);
      padding: var(--space-8);
      box-shadow: var(--shadow-lg);
    }

    .form-header {
      text-align: center;
      margin-bottom: var(--space-6);
    }

    .form-header h1 {
      font-size: 1.75rem;
      margin-bottom: var(--space-2);
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4);
    }

    @media (max-width: 600px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }

    .alert {
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-4);
    }

    .alert-success {
      background: rgba(16, 185, 129, 0.1);
      color: var(--color-success);
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .alert-error {
      background: rgba(239, 68, 68, 0.1);
      color: var(--color-error);
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .form-actions {
      display: flex;
      gap: var(--space-3);
      justify-content: flex-end;
      margin-top: var(--space-6);
      padding-top: var(--space-4);
      border-top: 1px solid rgba(0, 0, 0, 0.05);
    }
    
    .checkbox-group {
        display: flex;
        align-items: center;
        gap: var(--space-2);
    }
    
    .checkbox-group input {
        width: 1.25rem;
        height: 1.25rem;
    }
    
    .image-upload-section {
      margin-top: var(--space-2);
    }
    
    .file-input {
      display: none;
    }
    
    .file-label {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-4);
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
      color: white;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      font-weight: 500;
    }
    
    .file-label:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }
    
    .file-label .icon {
      font-size: 1.25rem;
    }
    
    .image-preview-container {
      position: relative;
      margin-top: var(--space-4);
      display: inline-block;
    }
    
    .image-preview {
      max-width: 100%;
      max-height: 300px;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      objectobject-fit: cover;
    }
    
    .remove-image-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(239, 68, 68, 0.9);
      color: white;
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    
    .remove-image-btn:hover {
      background: rgba(220, 38, 38, 1);
    }
    
    .image-help-text {
      margin-top: var(--space-2);
      font-size: 0.875rem;
      color: var(--text-muted);
    }
  `]
})
export class CarFormComponent implements OnInit {
  car: CarRequest = {
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    owner: 'CarRent Fleet',
    dailyPrice: 100
  };

  // Additional field for handling availability mapping differently if needed, 
  // though CarRequest usually doesn't strictly enforce 'available' input 
  // unless mapped. Backend usually defaults to true on Create. 
  // For Update, we might want to toggle it.
  carAvailable: boolean = true;

  imagePreview: string | null = null;
  selectedImageData: string | null = null;

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  isEditMode = false;
  carId: number | null = null;

  constructor(
    private carService: CarService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Redirect non-admins
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/cars']);
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.carId = +params['id'];
        this.loadCar(this.carId);
      }
    });
  }

  loadCar(id: number): void {
    this.isLoading = true;
    this.carService.getCarById(id).subscribe({
      next: (car) => {
        this.car = {
          brand: car.brand,
          model: car.model,
          year: car.year,
          owner: car.owner,
          dailyPrice: +car.dailyPrice,
          imageData: car.imageData
        };
        if (car.imageData) {
          this.imagePreview = car.imageData;
          this.selectedImageData = car.imageData;
        }
        this.carAvailable = car.available;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load car details';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.car.brand || !this.car.model || !this.car.year || !this.car.dailyPrice) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Include image data in request
    const carData = { ...this.car, imageData: this.selectedImageData || undefined };

    if (this.isEditMode && this.carId) {
      // For update, we might want to include available status
      const updateRequest = { ...carData, available: this.carAvailable };

      this.carService.updateCar(this.carId, updateRequest as any).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Car updated successfully!';
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to update car.';
        }
      });
    } else {
      this.carService.addCar(carData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.successMessage = `${response.brand} ${response.model} added successfully!`;
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to add car. Please try again.';
        }
      });
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'Image size must be less than 5MB';
        return;
      }

      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        this.errorMessage = 'Only JPEG, PNG, and WebP images are allowed';
        return;
      }

      // Read file as Base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.selectedImageData = base64String;
        this.imagePreview = base64String;
        this.errorMessage = '';
      };
      reader.onerror = () => {
        this.errorMessage = 'Failed to read image file';
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedImageData = null;
    this.imagePreview = null;
    // Reset file input
    const fileInput = document.getElementById('carImage') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
