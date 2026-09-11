package org.mendez.mr.myrecipesapi.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.mendez.mr.myrecipesapi.enums.RecipeCategory;

import java.util.List;
import java.util.UUID;

public record CreateRecipeRequest(

        @NotNull(message = "userId es obligatorio")
        UUID userId,

        @NotBlank(message = "title es obligatorio")
        @Size(max = 150, message = "title no puede superar 150 caracteres")
        String title,

        @Size(max = 1000, message = "description no puede superar 1000 caracteres")
        String description,

        @NotNull(message = "category es obligatoria")
        RecipeCategory category,

        @Size(max = 500, message = "summaryChanges no puede superar 500 caracteres")
        String summaryChanges,

        @Size(max = 1000, message = "notes no puede superar 1000 caracteres")
        String notes,

        @Min(value = 1, message = "rating debe estar entre 1 y 10")
        @Max(value = 10, message = "rating debe estar entre 1 y 10")
        Integer rating,

        @NotEmpty(message = "la receta debe tener al menos un ingrediente")
        List<@Valid CreateRecipeIngredientRequest> ingredients,

        @NotEmpty(message = "la receta debe tener al menos un paso")
        List<@Valid CreateRecipeStepRequest> steps,

        List<@Valid CreatePhotoRequest> photos

) {
}