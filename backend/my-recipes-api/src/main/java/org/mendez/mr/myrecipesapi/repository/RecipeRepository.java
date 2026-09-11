package org.mendez.mr.myrecipesapi.repository;

import org.mendez.mr.myrecipesapi.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RecipeRepository extends JpaRepository<Recipe, UUID> {

    List<Recipe> findByUserIdOrderByUpdatedAtDesc(UUID userId);

    Optional<Recipe> findByIdAndUserId(UUID id, UUID userId);

}
