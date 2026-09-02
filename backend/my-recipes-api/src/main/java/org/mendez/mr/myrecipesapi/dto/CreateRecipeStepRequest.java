package org.mendez.mr.myrecipesapi.dto;

public record CreateRecipeStepRequest(
        Integer order,
        String description
) {
}