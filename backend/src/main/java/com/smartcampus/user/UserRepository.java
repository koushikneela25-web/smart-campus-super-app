package com.smartcampus.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByCollegeId(String collegeId);

    @Query("SELECT u FROM User u WHERE u.email = :identifier OR u.collegeId = :identifier")
    Optional<User> findByEmailOrCollegeId(String identifier);

    boolean existsByEmail(String email);

    boolean existsByCollegeId(String collegeId);

    List<User> findByRole(Role role);

    long countByRole(Role role);

    long countByStatus(UserStatus status);
}
