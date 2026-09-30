package org.mendez.mr.myrecipesapi.dto;

public record RecipeWithCurrentVersionResponse(
        RecipeResponse recipe,
        RecipeVersionResponse currentVersion
) {
}
