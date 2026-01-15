// Car Models - matching backend DTOs

export interface CarRequest {
    brand: string;
    model: string;
    year: number;
    owner: string;
    dailyPrice: number;
    imageData?: string;  // Base64 image
}

export interface CarResponse {
    carId: number;
    brand: string;
    model: string;
    year: number;
    owner: string;
    available: boolean;
    dailyPrice: number;
    usageCount: number;
    createdAt: string;
    score: number;
    scoreCategory: string;
    ownerId?: number;
    imageData?: string;
}

export interface CarStatistics {
    totalCars: number;
    availableCars: number;
    averageDailyPrice: number;
    minDailyPrice: number;
    maxDailyPrice: number;
    averageUsageCount: number;
    brandDistribution: { [brand: string]: number };
    mostPopularCar: CarResponse | null;
}

export interface AvailabilityResponse {
    available: boolean;
    message: string;
}
