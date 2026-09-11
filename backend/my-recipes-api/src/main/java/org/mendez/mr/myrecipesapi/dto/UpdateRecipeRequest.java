package org.mendez.mr.myrecipesapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.mendez.mr.myrecipesapi.enums.RecipeCategory;

import java.util.UUID;

public record UpdateRecipeRequest(

        @NotNull(message = "userId es obligatorio")
        UUID userId,

        @NotBlank(message = "title es obligatorio")
        @Size(max = 150, message = "title no puede superar 150 caracteres")
        String title,

        @Size(max = 1000, message = "description no puede superar 1000 caracteres")
        String description,

        @NotNull(message = "category es obligatoria")
        RecipeCategory category

) {
}