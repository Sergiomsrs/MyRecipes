package org.mendez.mr.myrecipesapi.repository;

import org.mendez.mr.myrecipesapi.entity.RecipeVersion;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface RecipeVersionRepository extends JpaRepository<RecipeVersion, UUID> {
    List<RecipeVersion> findByRecipeId(UUID id);
    List<RecipeVersion> findByRecipeIdOrderByVersionNumber(UUID recipeId);

    long countByRecipeId(UUID id);

    @EntityGraph(attributePaths = "recipe")
    List<RecipeVersion> findByIdIn(Collection<UUID> ids);

}
