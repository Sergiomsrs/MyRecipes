package org.mendez.mr.myrecipesapi.security.controller;

import jakarta.validation.Valid;
import org.mendez.mr.myrecipesapi.entity.User;
import org.mendez.mr.myrecipesapi.repository.UserRepository;
import org.mendez.mr.myrecipesapi.security.dto.AuthResponse;
import org.mendez.mr.myrecipesapi.security.dto.LoginRequest;
import org.mendez.mr.myrecipesapi.security.dto.RegisterRequest;
import org.mendez.mr.myrecipesapi.security.service.CustomUserDetails;
import org.mendez.mr.myrecipesapi.security.service.JwtService;
import org.mendez.mr.myrecipesapi.security.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;
    private final UserRepository userRepository;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UserService userService,
            UserRepository userRepository
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = customUserDetails.getUser();

        String token = jwtService.generateToken(
                user.getId().toString(),
                user.getEmail(),
                user.getRole()
        );

        return ResponseEntity.ok(new AuthResponse(token, user.getRole(), user.getId()));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            return ResponseEntity.badRequest().build();
        }

        User user = new User(request.email(), request.password(), "USER");
        user = userService.registerUser(user);

        String token = jwtService.generateToken(
                user.getId().toString(),
                user.getEmail(),
                user.getRole()
        );

        return ResponseEntity.ok(new AuthResponse(token, user.getRole(), user.getId()));
    }
}
