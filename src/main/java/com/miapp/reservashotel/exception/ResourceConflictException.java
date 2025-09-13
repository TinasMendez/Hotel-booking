package com.miapp.reservashotel.exception;

/**
 * Signals a 409 Conflict in the REST layer.
 * Example: trying to delete a Product that is referenced by Bookings.
 */
public class ResourceConflictException extends RuntimeException {
    public ResourceConflictException(String message) {
        super(message);
    }
}

