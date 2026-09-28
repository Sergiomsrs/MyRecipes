package org.mendez.mr.myrecipesapi.security.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LoginRequest {

    @NotBlank(message = "email es obligatorio")
    @Email(message = "email debe ser un email válido")
    @Size(max = 255, message = "email no puede superar 255 caracteres")
    private String email;

    @NotBlank(message = "password es obligatorio")
    @Size(max = 72, message = "password no puede superar 72 caracteres")
    private String password;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
