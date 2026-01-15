// Rental Models - matching backend DTOs

export type RentalStatus = 'ACTIVE' | 'RETURNED' | 'OVERDUE' | 'CANCELLED';

export interface RentalRequest {
    carId: number;
    startDate: string; // ISO datetime string
    endDate: string;   // ISO datetime string
}

export interface RentalResponse {
    rentalId: number;
    userId: number;
    carId: number;
    startDate: string;
    endDate: string;
    actualReturnDate: string | null;
    status: RentalStatus;
    totalPrice: number;
    latePenalty: number;
    createdAt: string;
}
