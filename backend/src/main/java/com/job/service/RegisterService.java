package com.job.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.job.dto.register.RegisterRequest;
import com.job.dto.register.RegisterResponse;
import com.job.entity.employer.EmployerProfile;
import com.job.entity.jobseeker.JobSeekerProfile;
import com.job.entity.registerentity.UserAuth;
import com.job.repository.UserAuthRepository;
import com.job.repository.employer.EmployerProfileRepo;
import com.job.repository.jobseeker.JobSeekerProfileRepo;
import com.job.enums.Role;
import com.job.mapper.Register_Mapper;


@Service
public class RegisterService {

    @Autowired
    private UserAuthRepository userRepository;

    @Autowired
    private JobSeekerProfileRepo jobseeker_repo;

    @Autowired
    private EmployerProfileRepo employer_repo;
    
    @Autowired
    private Register_Mapper register_mapper;


    public RegisterResponse createUser(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        UserAuth savedUser = userRepository.save(register_mapper.dto_to_entity(request));
        if(savedUser.getRole() == Role.JOB_SEEKER) {
        	JobSeekerProfile jobseeker = new JobSeekerProfile();
        	jobseeker.setUserAuth(savedUser);
            jobseeker.setCreatedAt(LocalDateTime.now());
        	jobseeker.setEmail(savedUser.getEmail());
        	jobseeker_repo.save(jobseeker);
        }
        else if(savedUser.getRole() == Role.EMPLOYER) {
        	EmployerProfile employer = new EmployerProfile();
        	employer.setUserAuth(savedUser);
            employer.setCreatedAt(LocalDateTime.now());
        	employer.setEmail(savedUser.getEmail());
        	employer_repo.save(employer);
        }

        return register_mapper.entity_to_dto(savedUser);
    }
  }