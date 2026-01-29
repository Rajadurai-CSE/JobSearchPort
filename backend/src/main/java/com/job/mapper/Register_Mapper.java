package com.job.mapper;

import com.job.dto.auth.RegisterRequest;
import com.job.dto.auth.RegisterResponse;
import com.job.entity.registerentity.UserAuth;
import com.job.enums.Approval_Status;
import com.job.enums.Role;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class Register_Mapper {

  @Autowired
  private PasswordEncoder passwordEncoder;

  public UserAuth dto_to_entity(RegisterRequest request) {
    UserAuth user = new UserAuth();
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRole(request.getRole());
    if (request.getRole() == Role.EMPLOYER) {
      user.setStatus(Approval_Status.PENDING);
    } else if (request.getRole() == Role.JOB_SEEKER) {
      user.setStatus(Approval_Status.APPROVED);
    }
    return user;
  }

  public RegisterResponse entity_to_dto(UserAuth user) {
    RegisterResponse response = new RegisterResponse(user.getUserid(), user.getEmail(), user.getRole(),
        user.getStatus());
    return response;
  }
}
