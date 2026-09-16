package org.mendez.mr.myrecipesapi.service;

import org.mendez.mr.myrecipesapi.dto.CreateRecipeRequest;
import org.mendez.mr.myrecipesapi.dto.CreateVersionRequest;
import org.mendez.mr.myrecipesapi.dto.RecipeResponse;
import org.mendez.mr.myrecipesapi.dto.RecipeVersionResponse;
import org.mendez.mr.myrecipesapi.dto.UpdateRecipeRequest;

import java.util.List;
import java.util.UUID;

public interface RecipeService {

    List<RecipeResponse> getRecipes(UUID userId);

    RecipeResponse getRecipe(UUID recipeId, UUID userId);

    RecipeResponse createRecipe(CreateRecipeRequest request, UUID userId);

    RecipeResponse updateRecipe(UUID recipeId, UpdateRecipeRequest request, UUID userId);

    RecipeVersionResponse getCurrentVersion(UUID recipeId, UUID userId);

    RecipeVersionResponse createVersion(UUID recipeId, CreateVersionRequest request, UUID userId);

    List<RecipeVersionResponse> getVersions(UUID recipeId, UUID userId);

    void deleteRecipe(UUID recipeId, UUID userId);
}
