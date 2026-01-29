package com.job.exceptions;

import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST) //400
public class InvalidEmployerOperationException extends RuntimeException {
    public InvalidEmployerOperationException(String message) {
        super(message);
    }
}   