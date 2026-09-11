package org.mendez.mr.myrecipesapi.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record RecipeVersionResponse(
        UUID id,
        UUID recipeId,
        Integer versionNumber,
        String summaryChanges,
        String notes,
        Integer rating,
        Instant createdAt,
        List<RecipeIngredientResponse> ingredients,
        List<RecipeStepResponse> steps,
        List<PhotoResponse> photos
) {
}