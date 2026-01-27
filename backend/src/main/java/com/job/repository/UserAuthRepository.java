package com.job.repository;

import org.springframework.stereotype.Repository;

import com.job.entity.registerentity.UserAuth;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserAuthRepository extends JpaRepository<UserAuth,Long> {
  Optional<UserAuth> findByEmail(String email);
  boolean existsByEmail(String email);
}
