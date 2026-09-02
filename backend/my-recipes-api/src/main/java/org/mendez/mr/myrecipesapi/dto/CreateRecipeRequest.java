package org.mendez.mr.myrecipesapi.dto;

import org.mendez.mr.myrecipesapi.enums.RecipeCategory;

import java.util.List;
import java.util.UUID;

public record CreateRecipeRequest(

        UUID userId,
        String title,
        String description,
        RecipeCategory category,

        String summaryChanges,
        String notes,
        Integer rating,

        List<CreateRecipeIngredientRequest> ingredients,
        List<CreateRecipeStepRequest> steps,
        List<CreatePhotoRequest> photos

) {
}
