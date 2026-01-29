package com.job.config;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.job.entity.registerentity.UserAuth;
import com.job.enums.Approval_Status;
import com.job.enums.Role;
import com.job.repository.UserAuthRepository;

import jakarta.annotation.PostConstruct;

@Component
public class AdminInitializer {

    private final PasswordEncoder passwordEncoder;
    private final UserAuthRepository repo;
    
    public AdminInitializer(PasswordEncoder passwordEncoder, UserAuthRepository userRepository){
        this.repo = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void init() {
        if(repo.findByEmail("admin@jsp.com").isPresent()) return;
        UserAuth admin = new UserAuth();
        admin.setEmail("admin@jsp.com");
        admin.setPassword(passwordEncoder.encode("admin@jsp"));
        admin.setRole(Role.ADMIN);
        admin.setStatus(Approval_Status.APPROVED);
        repo.save(admin);
    }
}