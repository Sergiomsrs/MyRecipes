package org.mendez.mr.myrecipesapi.security.service;

import org.mendez.mr.myrecipesapi.entity.User;
import org.mendez.mr.myrecipesapi.exception.BadRequestException;
import org.mendez.mr.myrecipesapi.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class UserService {

    private static final int BCRYPT_MAX_BYTES = 72;

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public User registerUser(User user) {
        user.setEmail(normalizeEmail(user.getEmail()));
        user.setPassword(encode(user.getPassword()));
        return userRepository.save(user);
    }

    public void changePassword(User user, String rawCurrentPassword, String rawNewPassword) {
        if (!passwordEncoder.matches(rawCurrentPassword, user.getPassword())) {
            throw new IllegalArgumentException("La contraseña actual es incorrecta");
        }
        user.setPassword(encode(rawNewPassword));
        userRepository.save(user);
    }

    private String encode(String rawPassword) {
        try {
            return passwordEncoder.encode(rawPassword);
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("La contraseña no puede superar los " + BCRYPT_MAX_BYTES + " bytes");
        }
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
