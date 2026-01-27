package com.job.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.job.dto.register.RegisterRequest;
import com.job.dto.register.RegisterResponse;
import com.job.service.RegisterService;

@RestController
// @RequestMapping("/register")
public class RegisterController {

  @Autowired
	private RegisterService service;

  @PostMapping("/register")
	public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(service.createUser(request));
	}
}
