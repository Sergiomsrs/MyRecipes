package org.mendez.mr.myrecipesapi.security.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

        @NotBlank(message = "email es obligatorio")
        @Email(message = "email debe ser un email válido")
        String email,

        @NotBlank(message = "password es obligatorio")
        @Size(min = 6, message = "password debe tener al menos 6 caracteres")
        String password

) {
}
