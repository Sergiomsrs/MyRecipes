package org.mendez.mr.myrecipesapi.security.service;

import org.mendez.mr.myrecipesapi.entity.User;
import org.mendez.mr.myrecipesapi.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(UUID id) {
        return userRepository.findById(id);
    }

    public boolean authenticateUser(String email, String rawPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            return passwordEncoder.matches(rawPassword, userOpt.get().getPassword());
        }
        return false;
    }

    public void changePassword(User user, String rawCurrentPassword, String rawNewPassword) {
        if (!passwordEncoder.matches(rawCurrentPassword, user.getPassword())) {
            throw new IllegalArgumentException("La contraseña actual es incorrecta");
        }
        user.setPassword(passwordEncoder.encode(rawNewPassword));
        userRepository.save(user);
    }
}
