package org.mendez.mr.myrecipesapi.repository;

import org.mendez.mr.myrecipesapi.entity.RecipeIngredient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RecipeIngredientRepository
        extends JpaRepository<RecipeIngredient, UUID> {

    List<RecipeIngredient> findByRecipeVersionIdOrderByOrderIndex(UUID recipeVersionId);

}
