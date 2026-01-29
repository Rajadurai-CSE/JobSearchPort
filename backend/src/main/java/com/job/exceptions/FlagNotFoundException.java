package com.job.exceptions;

import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;

@ResponseStatus(HttpStatus.NOT_FOUND) // 404
public class FlagNotFoundException extends RuntimeException{
    public FlagNotFoundException(String e){
        super(e);
    }
}
