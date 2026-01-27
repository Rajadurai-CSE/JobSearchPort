package com.job.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.job.entity.registerentity.UserAuth;
import com.job.enums.Approval_Status;
import com.job.enums.Role;
import com.job.repository.UserAuthRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserAuthRepository userAuthRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create admin user if not exists
        String adminEmail = "admin@jobportal.com";

        if (!userAuthRepository.existsByEmail(adminEmail)) {
            UserAuth admin = new UserAuth();
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRole(Role.ADMIN);
            admin.setStatus(Approval_Status.APPROVED);

            userAuthRepository.save(admin);
            System.out.println("Admin user created: " + adminEmail);
        }
    }
}
