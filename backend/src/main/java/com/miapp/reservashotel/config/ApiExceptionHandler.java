package com.miapp.reservashotel.config;

import com.miapp.reservashotel.exception.BookingNotAvailableException;
import com.miapp.reservashotel.exception.ResourceConflictException;
import com.miapp.reservashotel.exception.ResourceNotFoundException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * High-precedence API exception handler that maps domain exceptions to proper HTTP codes.
 * This takes precedence over GlobalExceptionHandler(@Order(100)).
 */
@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class ApiExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {
        return error(HttpStatus.NOT_FOUND, "NOT_FOUND", messageOrDefault(ex.getMessage(), "Resource not found"));
    }

    @ExceptionHandler(ResourceConflictException.class)
    public ResponseEntity<Map<String, Object>> handleConflict(ResourceConflictException ex) {
        String code = ex.getCode();
        return error(HttpStatus.CONFLICT, code == null ? "RESOURCE_CONFLICT" : code,
                messageOrDefault(ex.getMessage(), "Resource conflict"));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        return error(HttpStatus.BAD_REQUEST, "BAD_REQUEST", messageOrDefault(ex.getMessage(), "Invalid request"));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException ex) {
        return error(HttpStatus.FORBIDDEN, "FORBIDDEN", "You are not allowed to perform this action");
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleAuthentication(AuthenticationException ex) {
        return error(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Authentication is required");
    }

    @ExceptionHandler(BookingNotAvailableException.class)
    public ResponseEntity<Map<String, Object>> handleBookingUnavailable(BookingNotAvailableException ex) {
        Map<String, Object> details = new LinkedHashMap<>();
        details.put("productId", ex.getProductId());
        details.put("startDate", ex.getStartDate());
        details.put("endDate", ex.getEndDate());
        List<Map<String, Object>> conflicts = ex.getConflicts().stream()
                .map(conflict -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("bookingId", conflict.bookingId());
                    map.put("startDate", conflict.startDate());
                    map.put("endDate", conflict.endDate());
                    return map;
                })
                .toList();
        details.put("conflicts", conflicts);

        return error(HttpStatus.UNPROCESSABLE_ENTITY,
                "BOOKING_DATES_UNAVAILABLE",
                messageOrDefault(ex.getMessage(), "Selected dates are not available"),
                details);
    }

    @ExceptionHandler({ MethodArgumentNotValidException.class, BindException.class })
    public ResponseEntity<Map<String, Object>> handleValidation(Exception ex) {
        Map<String, String> fieldErrors;
        if (ex instanceof MethodArgumentNotValidException manv) {
            fieldErrors = manv.getBindingResult().getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            err -> err.getField(),
                            err -> err.getDefaultMessage(),
                            (a, b) -> a,
                            LinkedHashMap::new
                    ));
        } else if (ex instanceof BindException be) {
            fieldErrors = be.getBindingResult().getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            err -> err.getField(),
                            err -> err.getDefaultMessage(),
                            (a, b) -> a,
                            LinkedHashMap::new
                    ));
        } else {
            fieldErrors = Map.of();
        }

        Map<String, Object> details = fieldErrors.isEmpty() ? null : Map.of("fields", fieldErrors);
        return error(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", "Request validation failed", details);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleBodyParse(HttpMessageNotReadableException ex) {
        return error(HttpStatus.BAD_REQUEST, "BAD_REQUEST", "Malformed JSON request body");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleFallback(Exception ex) {
        return error(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", messageOrDefault(root(ex), "Unexpected error"));
    }

    private ResponseEntity<Map<String, Object>> error(HttpStatus status, String code, String message) {
        return error(status, code, message, null);
    }

    private ResponseEntity<Map<String, Object>> error(HttpStatus status, String code, String message, Object details) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("code", code);
        body.put("message", message);
        if (details != null) {
            body.put("details", details);
        }
        return ResponseEntity.status(status).body(body);
    }

    private String root(Throwable t) {
        Throwable cur = t;
        while (cur.getCause() != null) cur = cur.getCause();
        return cur.getMessage() != null ? cur.getMessage() : cur.getClass().getSimpleName();
    }

    private String messageOrDefault(String candidate, String fallback) {
        return (candidate == null || candidate.isBlank()) ? fallback : candidate;
    }
}
