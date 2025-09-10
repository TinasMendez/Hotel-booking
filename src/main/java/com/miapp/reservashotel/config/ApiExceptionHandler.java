package com.miapp.reservashotel.config;

import org.hibernate.PropertyValueException;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.core.annotation.Order;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.sql.SQLIntegrityConstraintViolationException;
import java.time.Instant;

/**
 * Global API exception handler with high precedence.
 * Produces RFC7807 ProblemDetail with useful "detail" taken from root cause.
 */
@RestControllerAdvice
@Order(1) // Higher precedence than other advices (lower number = higher priority)
public class ApiExceptionHandler {

    @ExceptionHandler({
            IllegalArgumentException.class,
            IllegalStateException.class,
            MethodArgumentNotValidException.class
    })
    public ProblemDetail handle400(Exception ex) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        pd.setTitle("Bad Request");
        pd.setDetail(safeMessage(ex));
        pd.setProperty("timestamp", Instant.now().toString());
        return pd;
    }

    @ExceptionHandler({
            DataIntegrityViolationException.class,
            ConstraintViolationException.class,
            SQLIntegrityConstraintViolationException.class,
            PropertyValueException.class
    })
    public ProblemDetail handle409(Exception ex) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.CONFLICT);
        pd.setTitle("Data Integrity Violation");
        pd.setDetail(safeMessage(ex));
        pd.setProperty("timestamp", Instant.now().toString());
        return pd;
    }

    @ExceptionHandler(JpaSystemException.class)
    public ProblemDetail handleJpa(JpaSystemException ex) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        pd.setTitle("JPA Error");
        pd.setDetail(safeDeepestMessage(ex));
        pd.setProperty("timestamp", Instant.now().toString());
        return pd;
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handle500(Exception ex) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        pd.setTitle("Internal Server Error");
        pd.setDetail(safeDeepestMessage(ex));
        pd.setProperty("timestamp", Instant.now().toString());
        return pd;
    }

    private String safeMessage(Throwable t) {
        String m = t.getMessage();
        return (m == null || m.isBlank()) ? t.getClass().getSimpleName() : m;
    }

    private String safeDeepestMessage(Throwable t) {
        Throwable cur = t;
        while (cur.getCause() != null) cur = cur.getCause();
        return safeMessage(cur);
    }
}


