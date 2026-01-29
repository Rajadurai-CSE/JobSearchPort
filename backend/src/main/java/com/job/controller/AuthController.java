package com.job.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.job.dto.auth.JwtResponse;
import com.job.dto.auth.LoginRequest;
import com.job.dto.auth.RegisterRequest;
import com.job.dto.auth.RegisterResponse;
import com.job.dto.employer.EmpProfileUpdateDto;
import com.job.dto.employer.EmployerDto;
import com.job.entity.employer.Company;
import com.job.service.AuthService;
import com.job.service.EmployerService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final EmployerService employerService;

    public AuthController(AuthService authService, EmployerService employerService) {
        this.authService = authService;
        this.employerService = employerService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        String token = authService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(new JwtResponse(token));
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.createUser(request));
    }

    // Public endpoints for employer setup (before login)
    @GetMapping("/setup/companies")
    public ResponseEntity<List<Company>> getCompaniesForSetup() {
        return ResponseEntity.ok(employerService.getAllCompanies());
    }

    @PutMapping("/setup/employer-profile")
    public ResponseEntity<EmployerDto> updateEmployerProfileForSetup(@RequestBody EmpProfileUpdateDto request) {
        return ResponseEntity.ok(employerService.updateProfile(request));
    }
}