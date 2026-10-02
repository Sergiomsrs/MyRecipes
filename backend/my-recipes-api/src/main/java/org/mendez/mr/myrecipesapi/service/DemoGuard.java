package org.mendez.mr.myrecipesapi.service;

import org.mendez.mr.myrecipesapi.entity.User;
import org.mendez.mr.myrecipesapi.enums.Role;
import org.mendez.mr.myrecipesapi.exception.DemoAccountException;
import org.mendez.mr.myrecipesapi.repository.RecipeRepository;
import org.mendez.mr.myrecipesapi.repository.RecipeVersionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Reglas de la cuenta demo (Role.DEMO).
 *
 * La comprobacion se hace aqui, en la capa de servicio, leyendo el User de la
 * base de datos. No se usan @PreAuthorize ni authorities porque el rol no viaja
 * como claim del JWT (ver ADR-016).
 */
@Component
public class DemoGuard {

    private final RecipeRepository recipeRepository;
    private final RecipeVersionRepository recipeVersionRepository;
    private final int maxRecipes;
    private final int maxVersionsPerRecipe;

    public DemoGuard(
            RecipeRepository recipeRepository,
            RecipeVersionRepository recipeVersionRepository,
            @Value("${app.demo.max-recipes}") int maxRecipes,
            @Value("${app.demo.max-versions-per-recipe}") int maxVersionsPerRecipe
    ) {
        this.recipeRepository = recipeRepository;
        this.recipeVersionRepository = recipeVersionRepository;
        this.maxRecipes = maxRecipes;
        this.maxVersionsPerRecipe = maxVersionsPerRecipe;
    }

    public void assertNotDemo(User user) {
        if (user.getRole() == Role.DEMO) {
            throw new DemoAccountException("No disponible en la cuenta demo");
        }
    }

    public void assertRecipeQuota(User user) {
        if (user.getRole() != Role.DEMO) {
            return;
        }
        if (recipeRepository.countByUserId(user.getId()) >= maxRecipes) {
            throw new DemoAccountException(
                    "Límite de la cuenta demo alcanzado: máximo " + maxRecipes + " recetas"
            );
        }
    }

    public void assertVersionQuota(User user, UUID recipeId) {
        if (user.getRole() != Role.DEMO) {
            return;
        }
        if (recipeVersionRepository.countByRecipeId(recipeId) >= maxVersionsPerRecipe) {
            throw new DemoAccountException(
                    "Límite de la cuenta demo alcanzado: máximo "
                            + maxVersionsPerRecipe + " versiones por receta"
            );
        }
    }
}