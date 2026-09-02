package org.mendez.mr.myrecipesapi.service;

import org.mendez.mr.myrecipesapi.dto.CreateRecipeRequest;
import org.mendez.mr.myrecipesapi.entity.Recipe;

public interface RecipeService {

    Recipe createRecipe(CreateRecipeRequest request);

}
