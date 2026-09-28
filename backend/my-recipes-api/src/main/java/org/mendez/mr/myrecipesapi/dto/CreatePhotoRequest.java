package org.mendez.mr.myrecipesapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreatePhotoRequest(

        @NotBlank(message = "la url de la foto es obligatoria")
        @Pattern(regexp = "https?://.+", message = "la url debe empezar por http:// o https://")
        @Size(max = 1000, message = "la url no puede superar 1000 caracteres")
        String url,

        @Size(max = 255, message = "caption no puede superar 255 caracteres")
        String caption

) {
}