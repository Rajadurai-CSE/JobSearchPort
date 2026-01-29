package com.job.dto.auth;

public class JwtResponse {
    private String token;

    public JwtResponse(String token) {
        this.token = token;
    }
    
    public String getToken() {
        return token;
    }
    public JwtResponse(){}
}