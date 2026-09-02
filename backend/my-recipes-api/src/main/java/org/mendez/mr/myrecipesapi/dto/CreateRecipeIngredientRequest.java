package org.mendez.mr.myrecipesapi.dto;

import java.math.BigDecimal;

public record CreateRecipeIngredientRequest(
        String name,
        BigDecimal quantity,
        String unit,
        Integer orderIndex
) {
}