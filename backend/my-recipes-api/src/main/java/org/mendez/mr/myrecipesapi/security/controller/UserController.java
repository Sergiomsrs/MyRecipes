package org.mendez.mr.myrecipesapi.security.controller;

import jakarta.validation.Valid;
import org.mendez.mr.myrecipesapi.entity.User;
import org.mendez.mr.myrecipesapi.security.dto.ChangePasswordRequest;
import org.mendez.mr.myrecipesapi.security.dto.UserProfileResponse;
import org.mendez.mr.myrecipesapi.security.service.CustomUserDetails;
import org.mendez.mr.myrecipesapi.security.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getProfile() {
        User user = getCurrentUser();
        return ResponseEntity.ok(new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getRole()
        ));
    }

    @PutMapping("/me/password")
    public ResponseEntity<Map<String, String>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        User user = getCurrentUser();
        try {
            userService.changePassword(user, request.currentPassword(), request.newPassword());
            return ResponseEntity.ok(Map.of("message", "Contraseña actualizada correctamente"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private User getCurrentUser() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        return userDetails.getUser();
    }
}
