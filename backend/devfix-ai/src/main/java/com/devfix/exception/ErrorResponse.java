package com.devfix.exception;

import java.time.LocalDateTime;

/**
 * The shape of every error response returned by this API.
 *
 * Example JSON output:
 * {
 *   "status": 404,
 *   "message": "Technology with id 99 not found",
 *   "timestamp": "2026-06-21T00:25:00"
 * }
 */
public class ErrorResponse {

    private int status;
    private String message;
    private LocalDateTime timestamp;

    public ErrorResponse(int status, String message) {
        this.status    = status;
        this.message   = message;
        this.timestamp = LocalDateTime.now();
    }

    // Getters (Jackson needs these to serialize to JSON)

    public int getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}
