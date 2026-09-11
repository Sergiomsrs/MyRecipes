package org.mendez.mr.myrecipesapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CreateRecipeIngredientRequest(

        @NotBlank(message = "el nombre del ingrediente es obligatorio")
        @Size(max = 150, message = "el nombre del ingrediente no puede superar 150 caracteres")
        String name,

        @NotNull(message = "la cantidad es obligatoria")
        BigDecimal quantity,

        @NotBlank(message = "la unidad es obligatoria")
        @Size(max = 50, message = "la unidad no puede superar 50 caracteres")
        String unit,

        @NotNull(message = "orderIndex es obligatorio")
        Integer orderIndex

) {
}