package com.miapp.reservashotel.exception;

import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Legacy global handler kept for compatibility but with lower precedence and
 * clearer error details. ApiExceptionHandler (in config package) has higher precedence.
 */
@RestControllerAdvice
@Order(100) // lower precedence than ApiExceptionHandler
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleAll(Exception ex) {
        String message = messageOrDefault(deepest(ex), "Unexpected error");
        return error(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", message);
    }

    private static String deepest(Throwable t) {
        Throwable cur = t;
        while (cur.getCause() != null) cur = cur.getCause();
        String m = cur.getMessage();
        return (m == null || m.isBlank()) ? cur.getClass().getSimpleName() : m;
    }

    private ResponseEntity<Map<String, Object>> error(HttpStatus status, String code, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("code", code);
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }

    private String messageOrDefault(String candidate, String fallback) {
        return (candidate == null || candidate.isBlank()) ? fallback : candidate;
    }
}


