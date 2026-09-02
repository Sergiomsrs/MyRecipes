package org.mendez.mr.myrecipesapi.controller;

import org.mendez.mr.myrecipesapi.dto.CreateRecipeRequest;
import org.mendez.mr.myrecipesapi.entity.Recipe;
import org.mendez.mr.myrecipesapi.service.RecipeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @PostMapping
    public ResponseEntity<Recipe> createRecipe(
            @RequestBody CreateRecipeRequest request
    ) {

        Recipe recipe = recipeService.createRecipe(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(recipe);
    }
}