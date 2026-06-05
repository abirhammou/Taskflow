package com.taskflow.user_service.repository;

import com.taskflow.user_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findByAvailableTrue();

    List<User> findBySkillsContaining(String skill);

    List<User> findByAvailableTrueAndSkillsContaining(String skill);
}