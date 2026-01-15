import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RentalRequest, RentalResponse } from '../models/rental.model';

@Injectable({
    providedIn: 'root'
})
export class RentalService {
    private readonly API_URL = '/api/rentals';

    constructor(private http: HttpClient) { }

    // Create a new rental
    createRental(carId: number, startDate: Date, endDate: Date): Observable<RentalResponse> {
        const request: RentalRequest = {
            carId,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        };
        return this.http.post<RentalResponse>(this.API_URL, request);
    }

    // Get current user's rentals
    getMyRentals(): Observable<RentalResponse[]> {
        return this.http.get<RentalResponse[]>(`${this.API_URL}/my-rentals`);
    }

    // Get rental by ID
    getRentalById(rentalId: number): Observable<RentalResponse> {
        return this.http.get<RentalResponse>(`${this.API_URL}/${rentalId}`);
    }

    // Return a car
    returnCar(rentalId: number): Observable<RentalResponse> {
        return this.http.put<RentalResponse>(`${this.API_URL}/${rentalId}/return`, {});
    }

    // Helper: Calculate rental days
    calculateDays(startDate: Date, endDate: Date): number {
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Helper: Estimate total price
    estimatePrice(dailyPrice: number, startDate: Date, endDate: Date): number {
        const days = this.calculateDays(startDate, endDate);
        return days * dailyPrice;
    }
}
