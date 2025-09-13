package com.miapp.reservashotel.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Robust OpenAPI configuration:
 * - Programmatic setup to avoid annotation-scan pitfalls.
 * - Global HTTP Bearer security scheme so the "Authorize" button appears.
 * - Includes all /api/** except endpoints prone to circular schemas for now.
 *   These can be re-enabled later once those controllers return DTOs.
 */
@Configuration
public class OpenApiConfig {

    private static final String BEARER_SCHEME_NAME = "BearerAuth";

    @Bean
    public OpenAPI api() {
        SecurityScheme bearerScheme = new SecurityScheme()
                .name(BEARER_SCHEME_NAME)
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT");

        return new OpenAPI()
                .info(new Info()
                        .title("Hotel Booking API")
                        .version("v1")
                        .description("Backend API for the hotel booking application")
                        .contact(new Contact().name("Team").email("support@example.com"))
                )
                .components(new Components().addSecuritySchemes(BEARER_SCHEME_NAME, bearerScheme))
                .addSecurityItem(new SecurityRequirement().addList(BEARER_SCHEME_NAME));
    }

    /**
     * Main public group: documents stable endpoints only.
     * Excludes admin & customers for now to avoid circular model resolution.
     */
    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("public")
                .pathsToMatch("/api/**")
                .pathsToExclude(
                        "/api/admin/**",
                        "/api/customers/**"
                )
                .build();
    }
}









