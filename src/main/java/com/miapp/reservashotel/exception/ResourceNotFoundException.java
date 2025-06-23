package com.miapp.reservashotel.exception;

/**
 * Custom exception to be thrown when a requested resource is not found
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
