package com.job.exceptions;

import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;

@ResponseStatus(HttpStatus.NOT_FOUND) // 404
public class JobNotFoundException extends RuntimeException{
    public JobNotFoundException(String e){
        super(e);
    }
}
