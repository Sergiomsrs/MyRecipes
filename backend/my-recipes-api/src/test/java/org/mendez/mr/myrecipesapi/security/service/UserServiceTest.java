package org.mendez.mr.myrecipesapi.security.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mendez.mr.myrecipesapi.entity.User;
import org.mendez.mr.myrecipesapi.exception.BadRequestException;
import org.mendez.mr.myrecipesapi.repository.UserRepository;

import java.nio.charset.StandardCharsets;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class UserServiceTest {

    private UserRepository userRepository;
    private UserService userService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        userService = new UserService(userRepository);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void guardaElEmailEnMinusculasYSinEspacios() {
        User saved = userService.registerUser(new User("  Test.User@Example.COM  ", "password123", "USER"));

        assertThat(saved.getEmail()).isEqualTo("test.user@example.com");
        assertThat(saved.getPassword()).isNotEqualTo("password123");
        assertThat(saved.getPassword()).startsWith("$2");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void rechazaPasswordsQueSuperanLos72BytesDeBcrypt() {
        User user = new User("test@example.com", "ñ".repeat(36), "USER");

        assertThat(user.getPassword().getBytes(StandardCharsets.UTF_8)).hasSize(72);

        assertThatThrownBy(() -> userService.registerUser(user))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("72 bytes");
    }

    @Test
    void rechazaUnaNuevaPasswordQueSuperaLos72BytesAlCambiarla() {
        User user = new User("test@example.com", "password123", "USER");
        String[] encoded = userService.registerUser(user).getPassword().split("\\" + userService.password());
        assertThat(encoded).isNotEmpty();

        assertThatThrownBy(() -> userService.changePassword(user, encoded[encoded.length - 1], "ñ".repeat(36)))
                .isInstanceOf(BadRequestException.class);
    }
}
