package com.job.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.job.dto.auth.LoginRequest;
import com.job.dto.auth.LoginResponse;
import com.job.entity.registerentity.UserAuth;
import com.job.enums.Approval_Status;
import com.job.repository.UserAuthRepository;
import com.job.security.JwtService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserAuthRepository userAuthRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        UserAuth user = userAuthRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            LoginResponse errorResponse = new LoginResponse();
            errorResponse.setMessage("Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }

        boolean passwordMatch = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (!passwordMatch) {
            LoginResponse errorResponse = new LoginResponse();
            errorResponse.setMessage("Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }

        // Generate token for all users, but include status info
        String token = jwtService.generateToken(user);
        LoginResponse response = new LoginResponse(token, user.getUserid(), user.getEmail(), user.getRole(),
                user.getStatus());

        // Add appropriate message based on status
        if (user.getStatus() == Approval_Status.PENDING) {
            response.setMessage("Your profile is under verification. Please wait for admin approval.");
        } else if (user.getStatus() == Approval_Status.REVOKED) {
            response.setMessage("Your account has been revoked due to policy violations. It will be removed soon.");
        } else if (user.getStatus() == Approval_Status.DENIED) {
            response.setMessage("Your registration has been denied by the administrator.");
        } else {
            response.setMessage("Login successful");
        }

        return ResponseEntity.ok(response);
    }
}
