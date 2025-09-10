package com.miapp.reservashotel.exception;

import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;

/**
 * Legacy global handler kept for compatibility but with lower precedence and
 * clearer error details. ApiExceptionHandler (in config package) has higher precedence.
 */
@RestControllerAdvice
@Order(100) // lower precedence than ApiExceptionHandler
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleAll(Exception ex) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        pd.setTitle("Internal Server Error");
        pd.setDetail(deepest(ex));
        pd.setProperty("timestamp", Instant.now().toString());
        return pd;
    }

    private static String deepest(Throwable t) {
        Throwable cur = t;
        while (cur.getCause() != null) cur = cur.getCause();
        String m = cur.getMessage();
        return (m == null || m.isBlank()) ? cur.getClass().getSimpleName() : m;
    }
}
 


