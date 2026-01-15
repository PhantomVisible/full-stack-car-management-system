package com.carmanagement.car.shared.exceptions;

public class UnauthorizedCarModificationException extends RuntimeException {
    public UnauthorizedCarModificationException(Long carId, Long userId) {
        super(String.format("User %d is not authorized to modify car %d. Only the owner can modify this car.", userId,
                carId));
    }
}
