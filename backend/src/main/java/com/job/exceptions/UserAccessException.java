package com.job.exceptions;

import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;

@ResponseStatus(HttpStatus.FORBIDDEN) //403
public class UserAccessException extends RuntimeException {
    public UserAccessException(String message) {
        super(message);
    }
}
        