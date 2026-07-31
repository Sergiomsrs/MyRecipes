package org.mendez.mr.myrecipesapi.repository;

import org.mendez.mr.myrecipesapi.entity.RecipeStep;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RecipeStepRepository extends JpaRepository<RecipeStep, UUID> {
}
