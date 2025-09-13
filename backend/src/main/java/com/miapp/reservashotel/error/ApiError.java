package com.miapp.reservashotel.error;

import java.time.OffsetDateTime;
import java.util.List;

/**
 * Standard API error payload used by the GlobalExceptionHandler.
 * Keeps responses predictable for clients and simplifies debugging.
 */
public class ApiError {
    private OffsetDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
    private List<String> details;

    // Getters and setters (no Lombok)
    public OffsetDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(OffsetDateTime timestamp) { this.timestamp = timestamp; }

    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }

    public String getError() { return error; }
    public void setError(String error) { this.error = error; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }

    public List<String> getDetails() { return details; }
    public void setDetails(List<String> details) { this.details = details; }

    // Fluent helper for convenience (not required)
    public ApiError withDetails(List<String> details) {
        this.details = details;
        return this;
    }
}

