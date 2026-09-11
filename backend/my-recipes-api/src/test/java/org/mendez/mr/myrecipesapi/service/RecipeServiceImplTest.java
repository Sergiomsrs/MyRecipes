package org.mendez.mr.myrecipesapi.service;

import org.junit.jupiter.api.Test;
import org.mendez.mr.myrecipesapi.dto.CreateRecipeIngredientRequest;
import org.mendez.mr.myrecipesapi.dto.CreateRecipeRequest;
import org.mendez.mr.myrecipesapi.dto.CreateRecipeStepRequest;
import org.mendez.mr.myrecipesapi.dto.RecipeResponse;
import org.mendez.mr.myrecipesapi.entity.Recipe;
import org.mendez.mr.myrecipesapi.entity.RecipeIngredient;
import org.mendez.mr.myrecipesapi.entity.RecipeStep;
import org.mendez.mr.myrecipesapi.entity.RecipeVersion;
import org.mendez.mr.myrecipesapi.enums.RecipeCategory;
import org.mendez.mr.myrecipesapi.repository.RecipeRepository;
import org.mendez.mr.myrecipesapi.repository.RecipeVersionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class RecipeServiceTest {

    @Autowired
    private RecipeService recipeService;

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private RecipeVersionRepository recipeVersionRepository;

    private CreateRecipeRequest buildRequest(UUID userId) {
        return new CreateRecipeRequest(
                userId,
                "Tortilla de patatas",
                "Receta tradicional",
                RecipeCategory.MAIN_COURSE,
                "Versión inicial",
                null,
                null,
                List.of(
                        new CreateRecipeIngredientRequest("Patatas", new BigDecimal("500"), "g", 1),
                        new CreateRecipeIngredientRequest("Huevos", new BigDecimal("4"), "unidad", 2)
                ),
                List.of(
                        new CreateRecipeStepRequest(1, "Pelar y cortar las patatas."),
                        new CreateRecipeStepRequest(2, "Freír las patatas.")
                ),
                List.of()
        );
    }

    @Test
    void shouldCreateRecipeWithInitialVersionAndContent() {

        UUID userId = UUID.randomUUID();

        RecipeResponse response = recipeService.createRecipe(buildRequest(userId));

        assertThat(response.id()).isNotNull();
        assertThat(response.userId()).isEqualTo(userId);
        assertThat(response.title()).isEqualTo("Tortilla de patatas");

        List<RecipeVersion> versions =
                recipeVersionRepository.findByRecipeId(response.id());

        assertThat(versions).hasSize(1);

        RecipeVersion version = versions.get(0);

        assertThat(version.getVersionNumber()).isEqualTo(1);
        assertThat(version.getRecipe().getId()).isEqualTo(response.id());
        assertThat(response.currentVersionId()).isEqualTo(version.getId());

        List<RecipeIngredient> ingredients = version.getIngredients();
        assertThat(ingredients).hasSize(2);
        assertThat(ingredients.get(0).getName()).isEqualTo("Patatas");
        assertThat(ingredients.get(0).getOrderIndex()).isEqualTo(1);
        assertThat(ingredients.get(1).getName()).isEqualTo("Huevos");

        List<RecipeStep> steps = version.getSteps();
        assertThat(steps).hasSize(2);
        assertThat(steps.get(0).getDescription()).isEqualTo("Pelar y cortar las patatas.");
    }

    @Test
    void shouldGetRecipesOfUser() {

        UUID userId = UUID.randomUUID();

        recipeService.createRecipe(buildRequest(userId));
        recipeService.createRecipe(buildRequest(userId));

        List<RecipeResponse> recipes = recipeService.getRecipes(userId);

        assertThat(recipes).hasSize(2);
    }
}