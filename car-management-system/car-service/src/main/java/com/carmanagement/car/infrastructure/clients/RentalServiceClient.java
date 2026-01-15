package com.carmanagement.car.infrastructure.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "rental-service", url = "http://localhost:8083", fallback = RentalServiceFallback.class)
public interface RentalServiceClient {

    @GetMapping("/api/rentals/car/{carId}/has-active-rentals")
    Boolean hasActiveRentals(@PathVariable("carId") Long carId);
}
