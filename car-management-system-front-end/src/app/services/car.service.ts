import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarRequest, CarResponse, CarStatistics, AvailabilityResponse } from '../models/car.model';

@Injectable({
    providedIn: 'root'
})
export class CarService {
    private readonly API_URL = '/api/cars';

    constructor(private http: HttpClient) { }

    // Get all cars
    getAllCars(): Observable<CarResponse[]> {
        return this.http.get<CarResponse[]>(this.API_URL);
    }

    // Get available cars only
    getAvailableCars(): Observable<CarResponse[]> {
        return this.http.get<CarResponse[]>(`${this.API_URL}/available`);
    }

    // Get recommended cars
    getRecommendedCars(): Observable<CarResponse[]> {
        return this.http.get<CarResponse[]>(`${this.API_URL}/recommended`);
    }

    // Search cars with filters
    searchCars(params: {
        brand?: string;
        model?: string;
        minYear?: number;
        maxYear?: number;
        available?: boolean;
    }): Observable<CarResponse[]> {
        let httpParams = new HttpParams();

        if (params.brand) httpParams = httpParams.set('brand', params.brand);
        if (params.model) httpParams = httpParams.set('model', params.model);
        if (params.minYear) httpParams = httpParams.set('minYear', params.minYear.toString());
        if (params.maxYear) httpParams = httpParams.set('maxYear', params.maxYear.toString());
        if (params.available !== undefined) httpParams = httpParams.set('available', params.available.toString());

        return this.http.get<CarResponse[]>(`${this.API_URL}/search`, { params: httpParams });
    }

    // Get car by ID
    getCarById(carId: number): Observable<CarResponse> {
        return this.http.get<CarResponse>(`${this.API_URL}/${carId}`);
    }

    // Get car statistics
    getStatistics(): Observable<CarStatistics> {
        return this.http.get<CarStatistics>(`${this.API_URL}/statistics`);
    }

    // Check car availability
    checkAvailability(carId: number): Observable<AvailabilityResponse> {
        return this.http.get<AvailabilityResponse>(`${this.API_URL}/${carId}/availability`);
    }

    // Admin: Add a new car
    addCar(car: CarRequest): Observable<CarResponse> {
        return this.http.post<CarResponse>(this.API_URL, car);
    }

    // Admin: Update a car
    updateCar(carId: number, car: CarRequest): Observable<CarResponse> {
        return this.http.put<CarResponse>(`${this.API_URL}/${carId}`, car);
    }

    // Admin: Delete a car
    deleteCar(carId: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${carId}`);
    }

    // Mark car as rented (internal use)
    markAsRented(carId: number): Observable<CarResponse> {
        return this.http.put<CarResponse>(`${this.API_URL}/${carId}/rent`, {});
    }

    // Mark car as available (internal use)
    markAsAvailable(carId: number): Observable<CarResponse> {
        return this.http.put<CarResponse>(`${this.API_URL}/${carId}/return`, {});
    }
}
