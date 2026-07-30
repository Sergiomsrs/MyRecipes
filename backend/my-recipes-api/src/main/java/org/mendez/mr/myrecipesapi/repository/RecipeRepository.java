package org.mendez.mr.myrecipesapi.repository;

import org.mendez.mr.myrecipesapi.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RecipeRepository extends JpaRepository<Recipe, UUID> {
}
