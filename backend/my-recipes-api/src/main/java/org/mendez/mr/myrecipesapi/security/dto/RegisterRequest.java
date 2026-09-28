package org.mendez.mr.myrecipesapi.security.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

        @NotBlank(message = "email es obligatorio")
        @Email(message = "email debe ser un email válido")
        @Size(max = 255, message = "email no puede superar 255 caracteres")
        String email,

        @NotBlank(message = "password es obligatorio")
        @Size(min = 8, max = 72, message = "password debe tener entre 8 y 72 caracteres")
        String password

) {
}
