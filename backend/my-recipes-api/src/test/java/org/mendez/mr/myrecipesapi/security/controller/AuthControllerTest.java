package org.mendez.mr.myrecipesapi.security.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mendez.mr.myrecipesapi.exception.BadRequestException;
import org.mendez.mr.myrecipesapi.repository.UserRepository;
import org.mendez.mr.myrecipesapi.security.dto.RegisterRequest;
import org.mendez.mr.myrecipesapi.security.service.JwtService;
import org.mendez.mr.myrecipesapi.security.service.UserService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AuthControllerTest {

    private UserRepository userRepository;
    private UserService userService;
    private AuthController authController;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        userService = mock(UserService.class);
        authController = new AuthController(
                mock(AuthenticationManager.class),
                mock(JwtService.class),
                userService,
                userRepository
        );
    }

    @Test
    void devuelve400SiElEmailYaEstaRegistrado() {
        when(userRepository.existsByEmailIgnoreCase("test@email.com")).thenReturn(true);

        assertThatThrownBy(() -> authController.register(new RegisterRequest("test@email.com", "password123")))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("ya está registrado");
    }

    @Test
    void devuelve400SiLaInsercionViolaElIndiceUnicoDeEmail() {
        when(userService.registerUser(any()))
                .thenThrow(new DataIntegrityViolationException("duplicate key value violates unique constraint"));

        assertThatThrownBy(() -> authController.register(new RegisterRequest("test@email.com", "password123")))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("ya está registrado");
    }
}
