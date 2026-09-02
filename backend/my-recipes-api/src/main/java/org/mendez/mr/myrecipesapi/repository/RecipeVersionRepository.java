package org.mendez.mr.myrecipesapi.repository;

import org.mendez.mr.myrecipesapi.entity.RecipeVersion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RecipeVersionRepository extends JpaRepository<RecipeVersion, UUID> {
    List<RecipeVersion> findByRecipeId(UUID id);
    List<RecipeVersion> findByRecipeIdOrderByVersionNumber(UUID recipeId);

}
