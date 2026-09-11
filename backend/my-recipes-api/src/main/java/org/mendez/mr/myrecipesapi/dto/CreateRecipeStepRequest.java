package org.mendez.mr.myrecipesapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateRecipeStepRequest(

        @NotNull(message = "order es obligatorio")
        Integer order,

        @NotBlank(message = "la descripción del paso es obligatoria")
        @Size(max = 2000, message = "la descripción del paso no puede superar 2000 caracteres")
        String description

) {
}