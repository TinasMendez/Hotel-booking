package com.miapp.reservashotel.exception;

/**
 * Signals a 409 Conflict in the REST layer.
 * Example: trying to delete a Product that is referenced by Bookings.
 */
public class ResourceConflictException extends RuntimeException {

    private final String code;

    public ResourceConflictException(String message) {
        this("RESOURCE_CONFLICT", message);
    }

    public ResourceConflictException(String code, String message) {
        super(message);
        this.code = (code == null || code.isBlank()) ? "RESOURCE_CONFLICT" : code;
    }

    public String getCode() {
        return code;
    }
}
