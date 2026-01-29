package com.job.service;

import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.job.dto.auth.RegisterRequest;
import com.job.dto.auth.RegisterResponse;
import com.job.entity.employer.EmployerProfile;
import com.job.entity.jobseeker.JobSeekerProfile;
import com.job.entity.registerentity.UserAuth;
import com.job.exceptions.InvalidCredentialsException;
import com.job.exceptions.UserAccessException;
import com.job.mapper.Register_Mapper;
import com.job.repository.UserAuthRepository;
import com.job.repository.employer.EmployerProfileRepo;
import com.job.repository.jobseeker.JobSeekerProfileRepo;
import com.job.util.JwtUtil;
import com.job.enums.Approval_Status;
import com.job.enums.Role;

@Service
public class AuthService {

    @Autowired
    private UserAuthRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JobSeekerProfileRepo jobseeker_repo;

    @Autowired
    private EmployerProfileRepo employer_repo;

    @Autowired
    private Register_Mapper register_mapper;

    @Autowired
    private PasswordEncoder encoder;

    public String login(String email, String rawPassword) {
        UserAuth user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!encoder.matches(rawPassword, user.getPassword())) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        // Only block DENIED users - PENDING and REVOKED can login to see status pages
        if (user.getStatus() == Approval_Status.DENIED) {
            throw new UserAccessException("Your registration has been denied");
        }
        return jwtUtil.generateToken(user);
    }

    public RegisterResponse createUser(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (request.getRole() == Role.ADMIN) {
            throw new RuntimeException("Admin registration not allowed");
        }

        UserAuth savedUser = userRepository.save(register_mapper.dto_to_entity(request));
        if (savedUser.getRole() == Role.JOB_SEEKER) {
            JobSeekerProfile jobseeker = new JobSeekerProfile();
            jobseeker.setUserAuth(savedUser);
            jobseeker.setCreatedAt(LocalDateTime.now());
            jobseeker.setEmail(savedUser.getEmail());
            jobseeker_repo.save(jobseeker);
        } else if (savedUser.getRole() == Role.EMPLOYER) {
            EmployerProfile employer = new EmployerProfile();
            employer.setUserAuth(savedUser);
            employer.setCreatedAt(LocalDateTime.now());
            employer.setEmail(savedUser.getEmail());
            employer_repo.save(employer);
        }
        return register_mapper.entity_to_dto(savedUser);
    }
}