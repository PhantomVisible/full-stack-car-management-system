package com.carmanagement.rental.infrastructure.controllers;

import com.carmanagement.rental.application.services.RentalService;
import com.carmanagement.rental.domain.models.Rental;
import com.carmanagement.rental.infrastructure.clients.AuthServiceClient;
import com.carmanagement.rental.infrastructure.security.JwtUtil;
import com.carmanagement.rental.shared.dtos.RentalRequest;
import com.carmanagement.rental.shared.dtos.RentalResponse;
import com.carmanagement.rental.shared.exceptions.UserNotFoundException; // Import specific exception
import feign.FeignException; // Import FeignException

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rentals")
public class RentalController {

    private final RentalService rentalService;
    private final JwtUtil jwtUtil;
    private final AuthServiceClient authServiceClient;

    public RentalController(RentalService rentalService, JwtUtil jwtUtil, AuthServiceClient authServiceClient) {
        this.rentalService = rentalService;
        this.jwtUtil = jwtUtil;
        this.authServiceClient = authServiceClient;
    }

    @PostMapping
    public ResponseEntity<RentalResponse> createRental(
            @Valid @RequestBody RentalRequest rentalRequest,
            @RequestHeader("Authorization") String authHeader) {

        // Extracting userId from token
        Long userId = extractUserIdFromToken(authHeader);

        Rental rental = rentalService.createRental(
                userId,
                rentalRequest.getCarId(),
                rentalRequest.getStartDate(),
                rentalRequest.getEndDate(),
                authHeader);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(toRentalResponse(rental));
    }

    @GetMapping("/car/{carId}/has-active-rentals")
    public ResponseEntity<Boolean> hasActiveRentals(@PathVariable Long carId) {
        boolean hasActive = rentalService.hasActiveRentals(carId);
        return ResponseEntity.ok(hasActive);
    }

    @GetMapping("/my-rentals")
    public ResponseEntity<List<RentalResponse>> getMyRentals(
            @RequestHeader("Authorization") String authHeader) {

        Long userId = extractUserIdFromToken(authHeader);
        List<Rental> rentals = rentalService.getUserRentals(userId);

        List<RentalResponse> responses = rentals.stream()
                .map(this::toRentalResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{rentalId}")
    public ResponseEntity<RentalResponse> getRentalById(
            @PathVariable Long rentalId,
            @RequestHeader("Authorization") String authHeader) {

        // Verify user has access to this rental
        Long userId = extractUserIdFromToken(authHeader);
        Rental rental = rentalService.getRentalById(rentalId);

        // Basic authorization check
        if (!rental.getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(toRentalResponse(rental));
    }

    @PutMapping("/{rentalId}/return")
    public ResponseEntity<RentalResponse> returnCar(
            @PathVariable Long rentalId,
            @RequestHeader("Authorization") String authHeader) {

        Long userId = extractUserIdFromToken(authHeader);
        Rental returnedRental = rentalService.returnCar(rentalId, userId, authHeader);
        return ResponseEntity.ok(toRentalResponse(returnedRental));
    }

    // Helper method to extract userId from JWT token
    private Long extractUserIdFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid authorization header");
        }

        String token = authHeader.substring(7);

        // Try to get userId from token
        Long userId = jwtUtil.extractUserId(token);

        if (userId != null) {
            return userId;
        }

        // Fallback: Call Auth Service to identify user from token
        try {
            AuthServiceClient.UserResponse user = authServiceClient.getCurrentUser(authHeader);
            return user.getUserId();
        } catch (FeignException.NotFound e) {
            throw new UserNotFoundException("User registration not found. Please register or log in again.",
                    "AUTH_INVALID");
        } catch (Exception e) {
            throw new RuntimeException("Unable to identify user from token. Please log in again.", e);
        }
    }

    // Convert Rental entity to RentalResponse DTO
    private RentalResponse toRentalResponse(Rental rental) {
        return new RentalResponse(
                rental.getRentalId(),
                rental.getUserId(),
                rental.getCarId(),
                rental.getStartDate(),
                rental.getEndDate(),
                rental.getActualReturnDate(),
                rental.getStatus(),
                rental.getTotalPrice(),
                rental.getLatePenalty(),
                rental.getCreatedAt());
    }
}