package org.mendez.mr.myrecipesapi.service;

import org.mendez.mr.myrecipesapi.dto.CreateRecipeRequest;
import org.mendez.mr.myrecipesapi.dto.RecipeResponse;
import org.mendez.mr.myrecipesapi.dto.RecipeVersionResponse;
import org.mendez.mr.myrecipesapi.dto.UpdateRecipeRequest;

import java.util.List;
import java.util.UUID;

public interface RecipeService {

    List<RecipeResponse> getRecipes(UUID userId);

    RecipeResponse getRecipe(UUID recipeId, UUID userId);

    RecipeResponse createRecipe(CreateRecipeRequest request);

    RecipeResponse updateRecipe(UUID recipeId, UpdateRecipeRequest request);

    RecipeVersionResponse getCurrentVersion(UUID recipeId, UUID userId);

    void deleteRecipe(UUID recipeId, UUID userId);

}