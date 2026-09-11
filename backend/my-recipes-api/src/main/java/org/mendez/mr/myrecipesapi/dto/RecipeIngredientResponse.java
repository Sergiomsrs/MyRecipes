package org.mendez.mr.myrecipesapi.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record RecipeIngredientResponse(
        UUID id,
        String name,
        BigDecimal quantity,
        String unit,
        Integer orderIndex
) {
}