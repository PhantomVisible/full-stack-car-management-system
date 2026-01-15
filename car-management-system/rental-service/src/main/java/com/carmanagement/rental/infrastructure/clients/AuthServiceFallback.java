package com.carmanagement.rental.infrastructure.clients;

import com.carmanagement.rental.shared.exceptions.ServiceUnavailableException;
import org.springframework.stereotype.Component;

@Component
public class AuthServiceFallback implements AuthServiceClient {

    @Override
    public UserResponse getUserById(Long userId, String token) {
        // Return cached user or throw ServiceUnavailableException
        throw new ServiceUnavailableException("Auth service is unavailable");
    }

    @Override
    public UserResponse getCurrentUser(String token) {
        throw new ServiceUnavailableException("Auth service is unavailable");
    }
}
