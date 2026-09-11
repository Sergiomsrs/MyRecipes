package org.mendez.mr.myrecipesapi.dto;

import org.mendez.mr.myrecipesapi.enums.RecipeCategory;

import java.time.Instant;
import java.util.UUID;

public record RecipeResponse(
        UUID id,
        UUID userId,
        String title,
        String description,
        RecipeCategory category,
        UUID currentVersionId,
        Instant createdAt,
        Instant updatedAt
) {
}