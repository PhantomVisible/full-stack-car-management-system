package com.carmanagement.car.infrastructure.controllers;

import com.carmanagement.car.application.services.CarService;
import com.carmanagement.car.domain.models.Car;
import com.carmanagement.car.shared.dtos.CarResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cars")
public class CarManagementController {

    private final CarService carService;

    public CarManagementController(CarService carService) {
        this.carService = carService;
    }

    @PutMapping("/{carId}/rent")
    public ResponseEntity<CarResponse> markAsRented(@PathVariable Long carId) {
        Car car = carService.markAsRented(carId);
        return ResponseEntity.ok(toCarResponse(car));
    }

    @PutMapping("/{carId}/return")
    public ResponseEntity<CarResponse> markAsAvailable(@PathVariable Long carId) {
        Car car = carService.markAsAvailable(carId);
        return ResponseEntity.ok(toCarResponse(car));
    }

    @GetMapping("/{carId}/availability")
    public ResponseEntity<AvailabilityResponse> checkAvailability(@PathVariable Long carId) {
        boolean available = carService.isCarAvailable(carId);
        String message = available ? "Car is available for rental" : "Car is currently rented";
        return ResponseEntity.ok(new AvailabilityResponse(available, message));
    }

    // You'll need these DTOs
    public record AvailabilityResponse(boolean available, String message) {
    }

    private CarResponse toCarResponse(Car car) {
        // Use your existing conversion logic
        return new CarResponse(
                car.getCarId(),
                car.getBrand(),
                car.getModel(),
                car.getYear(),
                car.getOwner(),
                car.getAvailable(),
                car.getDailyPrice(),
                car.getUsageCount(),
                car.getCreatedAt(),
                car.getOwnerId(),
                car.getImageData(),
                0.0, // score - you can calculate if needed
                "N/A" // score category
        );
    }
}