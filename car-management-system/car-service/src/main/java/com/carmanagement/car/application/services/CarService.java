package com.carmanagement.car.application.services;

import com.carmanagement.car.domain.ports.CarSearchPort;
import com.carmanagement.car.domain.models.Car;
import com.carmanagement.car.domain.ports.CarRepositoryPort;
import com.carmanagement.car.infrastructure.clients.RentalServiceClient;
import com.carmanagement.car.shared.exceptions.CarCurrentlyRentedException;
import com.carmanagement.car.shared.exceptions.CarHasActiveRentalsException;
import com.carmanagement.car.shared.exceptions.CarNotFoundException;
import com.carmanagement.car.shared.exceptions.CarNotAvailableException;
import com.carmanagement.car.shared.exceptions.UnauthorizedCarModificationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CarService {
    private static final Logger logger = LoggerFactory.getLogger(CarService.class);

    private final CarRepositoryPort carRepository;
    private final CarSearchPort carSearchPort;
    private final CarScoringService carScoringService;
    private final RentalServiceClient rentalServiceClient;

    public CarService(CarRepositoryPort carRepository, CarSearchPort carSearchPort,
            CarScoringService carScoringService, RentalServiceClient rentalServiceClient) {
        this.carRepository = carRepository;
        this.carSearchPort = carSearchPort;
        this.carScoringService = carScoringService;
        this.rentalServiceClient = rentalServiceClient;
    }

    public List<Car> getRecommendedCars() {
        List<Car> availableCars = carRepository.findByAvailableTrue();

        // Score and sort cars
        return availableCars.stream()
                .sorted((c1, c2) -> Double.compare(
                        carScoringService.calculateCarScore(c2), // Descending order
                        carScoringService.calculateCarScore(c1)))
                .collect(Collectors.toList());
    }

    public Car addCar(Car car) {
        return carRepository.save(car);
    }

    public Car updateCar(Long carId, Car carDetails, Long requestingUserId) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new CarNotFoundException(carId));

        // Validate ownership
        if (car.getOwnerId() != null && !car.getOwnerId().equals(requestingUserId)) {
            logger.warn("User {} attempted to modify car {} owned by {}", requestingUserId, carId, car.getOwnerId());
            throw new UnauthorizedCarModificationException(carId, requestingUserId);
        }

        // Check for active rentals
        validateNoActiveRentals(carId);

        // Update fields if provided
        Optional.ofNullable(carDetails.getBrand()).ifPresent(car::setBrand);
        Optional.ofNullable(carDetails.getModel()).ifPresent(car::setModel);
        Optional.ofNullable(carDetails.getYear()).ifPresent(car::setYear);
        Optional.ofNullable(carDetails.getOwner()).ifPresent(car::setOwner);
        Optional.ofNullable(carDetails.getDailyPrice()).ifPresent(car::setDailyPrice);
        Optional.ofNullable(carDetails.getAvailable()).ifPresent(car::setAvailable);
        Optional.ofNullable(carDetails.getImageData()).ifPresent(car::setImageData);

        return carRepository.save(car);
    }

    public void deleteCar(Long carId, Long requestingUserId) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new CarNotFoundException(carId));

        // Validate ownership
        if (car.getOwnerId() != null && !car.getOwnerId().equals(requestingUserId)) {
            logger.warn("User {} attempted to delete car {} owned by {}", requestingUserId, carId, car.getOwnerId());
            throw new UnauthorizedCarModificationException(carId, requestingUserId);
        }

        // Check availability and active rentals
        if (!car.getAvailable()) {
            throw new CarCurrentlyRentedException(carId);
        }

        validateNoActiveRentals(carId);

        carRepository.deleteById(carId);
    }

    private void validateNoActiveRentals(Long carId) {
        try {
            Boolean hasActive = rentalServiceClient.hasActiveRentals(carId);
            if (Boolean.TRUE.equals(hasActive)) {
                logger.warn("Car {} has active rentals, cannot modify", carId);
                throw new CarHasActiveRentalsException(carId);
            }
        } catch (Exception e) {
            // Log warning but allow operation if rental service is unavailable
            logger.warn("Could not verify rentals for car {}: {}. Allowing operation.", carId, e.getMessage());
        }
    }

    public Car getCarById(Long carId) {
        return carRepository.findById(carId)
                .orElseThrow(() -> new CarNotFoundException(carId));
    }

    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    public List<Car> getAvailableCars() {
        return carRepository.findByAvailableTrue();
    }

    public List<Car> searchCars(String brand, String model, Integer minYear, Integer maxYear, Boolean available) {
        return carSearchPort.searchCars(brand, model, minYear, maxYear, available);
    }

    public Car markAsRented(Long carId) {
        Car car = getCarById(carId);
        if (!car.getAvailable()) {
            throw new CarNotAvailableException(carId);
        }
        car.setAvailable(false);
        car.setUsageCount(car.getUsageCount() + 1);
        return carRepository.save(car);
    }

    public Car markAsAvailable(Long carId) {
        Car car = getCarById(carId);
        car.setAvailable(true);
        return carRepository.save(car);
    }

    public boolean isCarAvailable(Long carId) {
        Car car = getCarById(carId);
        return car.getAvailable();
    }
}