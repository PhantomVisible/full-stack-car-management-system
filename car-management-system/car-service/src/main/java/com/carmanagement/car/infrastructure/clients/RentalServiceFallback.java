package com.carmanagement.car.infrastructure.clients;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class RentalServiceFallback implements RentalServiceClient {

    private static final Logger log = LoggerFactory.getLogger(RentalServiceFallback.class);

    @Override
    public Boolean hasActiveRentals(Long carId) {
        log.warn("Rental service is unavailable. Allowing car modification for car {}", carId);
        // Return false to allow operations when rental service is down
        // This is a business decision - could also return true to be more conservative
        return false;
    }
}
