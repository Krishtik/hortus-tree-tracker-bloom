package com.realfoerstry.krish_hortus.exception;

/*
 * ResourceNotFoundException
 * ------------------------
 * This file defines a special error that is thrown when something (like a user)
 * can't be found in the database.
 *
 * This helps the API return a clear message instead of crashing.
 */

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String message, Exception e) {
        super(message, e);
    }
}
