package org.mendez.mr.myrecipesapi.dto;

import java.util.UUID;

public record RecipeStepResponse(
        UUID id,
        Integer order,
        String description
) {
}