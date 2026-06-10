package com.taskflow.user_service.service;

import com.taskflow.user_service.entity.User;
import com.taskflow.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // Récupérer tous les utilisateurs
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Récupérer un utilisateur par ID
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    // Créer un utilisateur
    public User createUser(User user) {
        return userRepository.save(user);
    }

    // Modifier un utilisateur
    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);
        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        user.setRole(userDetails.getRole());
        user.setAvailable(userDetails.isAvailable());
        user.setSkills(userDetails.getSkills());
        return userRepository.save(user);
    }

    // Supprimer un utilisateur
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // Logique métier : trouver utilisateurs disponibles par compétence
    public List<User> getAvailableUsersBySkill(String skill) {
        return userRepository.findByAvailableTrueAndSkillsContaining(skill);
    }

    // Mettre à jour la charge de travail
    public void incrementTaskCount(Long userId) {
        User user = getUserById(userId);
        user.setCurrentTaskCount(user.getCurrentTaskCount() + 1);
        if (user.getCurrentTaskCount() >= 5) {
            user.setAvailable(false);
        }
        userRepository.save(user);
    }

    // Décrémenter quand tâche terminée
    public void decrementTaskCount(Long userId) {
        User user = getUserById(userId);
        if (user.getCurrentTaskCount() > 0) {
            user.setCurrentTaskCount(user.getCurrentTaskCount() - 1);
        }
        user.setAvailable(true);
        userRepository.save(user);
    }
}