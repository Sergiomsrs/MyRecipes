package org.mendez.mr.myrecipesapi.controller;

import jakarta.validation.Valid;
import org.mendez.mr.myrecipesapi.dto.CreateRecipeRequest;
import org.mendez.mr.myrecipesapi.dto.CreateVersionRequest;
import org.mendez.mr.myrecipesapi.dto.RecipeResponse;
import org.mendez.mr.myrecipesapi.dto.RecipeVersionResponse;
import org.mendez.mr.myrecipesapi.dto.UpdateRecipeRequest;
import org.mendez.mr.myrecipesapi.security.service.CustomUserDetails;
import org.mendez.mr.myrecipesapi.service.RecipeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/recipes")
public class RecipeController {

    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @GetMapping
    public ResponseEntity<List<RecipeResponse>> getRecipes() {
        UUID userId = getCurrentUserId();
        return ResponseEntity.ok(recipeService.getRecipes(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeResponse> getRecipe(@PathVariable UUID id) {
        UUID userId = getCurrentUserId();
        return ResponseEntity.ok(recipeService.getRecipe(id, userId));
    }

    @PostMapping
    public ResponseEntity<RecipeResponse> createRecipe(
            @Valid @RequestBody CreateRecipeRequest request
    ) {
        UUID userId = getCurrentUserId();
        RecipeResponse response = recipeService.createRecipe(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecipeResponse> updateRecipe(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateRecipeRequest request
    ) {
        UUID userId = getCurrentUserId();
        return ResponseEntity.ok(recipeService.updateRecipe(id, request, userId));
    }

    @GetMapping("/{id}/versions/current")
    public ResponseEntity<RecipeVersionResponse> getCurrentVersion(
            @PathVariable UUID id
    ) {
        UUID userId = getCurrentUserId();
        return ResponseEntity.ok(recipeService.getCurrentVersion(id, userId));
    }

    @GetMapping("/{id}/versions")
    public ResponseEntity<List<RecipeVersionResponse>> getVersions(
            @PathVariable UUID id
    ) {
        UUID userId = getCurrentUserId();
        return ResponseEntity.ok(recipeService.getVersions(id, userId));
    }

    @PostMapping("/{id}/versions")
    public ResponseEntity<RecipeVersionResponse> createVersion(
            @PathVariable UUID id,
            @Valid @RequestBody CreateVersionRequest request
    ) {
        UUID userId = getCurrentUserId();
        RecipeVersionResponse response = recipeService.createVersion(id, request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable UUID id) {
        UUID userId = getCurrentUserId();
        recipeService.deleteRecipe(id, userId);
        return ResponseEntity.noContent().build();
    }

    private UUID getCurrentUserId() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        return userDetails.getUser().getId();
    }
}
