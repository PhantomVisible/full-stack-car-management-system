package com.carmanagement.api_gateway;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r
                        .path("/api/auth/**")
                        .uri("http://localhost:8081"))
                .route("car-service", r -> r
                        .path("/api/cars/**")
                        .uri("http://localhost:8082"))
                .route("rental-service", r -> r
                        .path("/api/rentals/**")
                        .uri("http://localhost:8083"))
                .build();
    }
}
