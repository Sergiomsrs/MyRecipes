package org.mendez.mr.myrecipesapi.controller;

import jakarta.validation.Valid;
import org.mendez.mr.myrecipesapi.dto.CreateRecipeRequest;

import org.mendez.mr.myrecipesapi.dto.RecipeResponse;
import org.mendez.mr.myrecipesapi.dto.RecipeVersionResponse;
import org.mendez.mr.myrecipesapi.dto.UpdateRecipeRequest;
import org.mendez.mr.myrecipesapi.service.RecipeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/recipes")
@CrossOrigin(origins = "http://localhost:5173")
public class RecipeController {

    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @GetMapping
    public ResponseEntity<List<RecipeResponse>> getRecipes(
            @RequestParam UUID userId
    ) {
        return ResponseEntity.ok(recipeService.getRecipes(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeResponse> getRecipe(
            @PathVariable UUID id,
            @RequestParam UUID userId
    ) {
        return ResponseEntity.ok(recipeService.getRecipe(id, userId));
    }

    @PostMapping
    public ResponseEntity<RecipeResponse> createRecipe(
            @Valid @RequestBody CreateRecipeRequest request
    ) {
        RecipeResponse response = recipeService.createRecipe(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecipeResponse> updateRecipe(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateRecipeRequest request
    ) {
        return ResponseEntity.ok(recipeService.updateRecipe(id, request));
    }

    @GetMapping("/{id}/versions/current")
    public ResponseEntity<RecipeVersionResponse> getCurrentVersion(
            @PathVariable UUID id,
            @RequestParam UUID userId
    ) {
        return ResponseEntity.ok(recipeService.getCurrentVersion(id, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(
            @PathVariable UUID id,
            @RequestParam UUID userId
    ) {
        recipeService.deleteRecipe(id, userId);
        return ResponseEntity.noContent().build();
    }
}