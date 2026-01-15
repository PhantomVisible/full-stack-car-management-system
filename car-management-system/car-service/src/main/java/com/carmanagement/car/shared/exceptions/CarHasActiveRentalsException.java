package com.carmanagement.car.shared.exceptions;

public class CarHasActiveRentalsException extends RuntimeException {
    public CarHasActiveRentalsException(Long carId) {
        super(String.format("Cannot modify or delete car %d because it has active rentals", carId));
    }
}
