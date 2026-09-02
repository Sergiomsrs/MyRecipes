package org.mendez.mr.myrecipesapi.service;

import org.junit.jupiter.api.Test;
import org.mendez.mr.myrecipesapi.dto.CreateRecipeRequest;
import org.mendez.mr.myrecipesapi.entity.Recipe;
import org.mendez.mr.myrecipesapi.entity.RecipeVersion;
import org.mendez.mr.myrecipesapi.enums.RecipeCategory;
import org.mendez.mr.myrecipesapi.repository.RecipeRepository;
import org.mendez.mr.myrecipesapi.repository.RecipeVersionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

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

    @Test
    void shouldCreateRecipeWithInitialVersion() {

        UUID userId = UUID.randomUUID();

        CreateRecipeRequest request = new CreateRecipeRequest(
                userId,
                "Tortilla de patatas",
                "Receta tradicional",
                RecipeCategory.MAIN_COURSE,
                "Versión inicial",
                null,
                null,
                List.of(),
                List.of(),
                List.of()
        );

        Recipe recipe = recipeService.createRecipe(request);

        assertThat(recipe.getId()).isNotNull();

        List<RecipeVersion> versions =
                recipeVersionRepository.findByRecipeId(recipe.getId());

        assertThat(versions).hasSize(1);

        RecipeVersion version = versions.get(0);

        assertThat(version.getVersionNumber()).isEqualTo(1);
        assertThat(version.getRecipe().getId()).isEqualTo(recipe.getId());
        assertThat(recipe.getCurrentVersionId()).isEqualTo(version.getId());
    }
}