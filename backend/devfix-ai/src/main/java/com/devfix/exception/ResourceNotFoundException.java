package com.devfix.exception;

/**
 * Thrown when a requested resource (e.g. Technology, TechError) does not exist in the DB.
 * Spring will map this to a 404 response via GlobalExceptionHandler.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
