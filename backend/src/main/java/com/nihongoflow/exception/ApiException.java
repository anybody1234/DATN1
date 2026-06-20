package com.nihongoflow.exception;

import org.springframework.http.HttpStatus;

public class ApiException extends RuntimeException {
    private final ErrorCode code;
    private final HttpStatus status;

    public ApiException(ErrorCode code, String message, HttpStatus status) {
        super(message);
        this.code = code;
        this.status = status;
    }

    public ErrorCode getCode() {
        return code;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public static ApiException notFound(String message) {
        return new ApiException(ErrorCode.NOT_FOUND, message, HttpStatus.NOT_FOUND);
    }

    public static ApiException unauthorized(String message) {
        return new ApiException(ErrorCode.UNAUTHORIZED, message, HttpStatus.UNAUTHORIZED);
    }

    public static ApiException forbidden(String message) {
        return new ApiException(ErrorCode.FORBIDDEN, message, HttpStatus.FORBIDDEN);
    }

    public static ApiException duplicateEmail(String message) {
        return new ApiException(ErrorCode.DUPLICATE_EMAIL, message, HttpStatus.CONFLICT);
    }

    public static ApiException validation(String message) {
        return new ApiException(ErrorCode.VALIDATION_ERROR, message, HttpStatus.BAD_REQUEST);
    }

    public static ApiException alreadyExists(String message) {
        return new ApiException(ErrorCode.ALREADY_EXISTS, message, HttpStatus.CONFLICT);
    }
}
