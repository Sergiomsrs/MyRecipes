package org.mendez.mr.myrecipesapi.repository;

import org.junit.jupiter.api.Test;
import org.mendez.mr.myrecipesapi.entity.Recipe;
import org.mendez.mr.myrecipesapi.entity.RecipeStep;
import org.mendez.mr.myrecipesapi.entity.RecipeVersion;
import org.mendez.mr.myrecipesapi.enums.RecipeCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class RecipeStepRepositoryTest {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private RecipeVersionRepository recipeVersionRepository;

    @Autowired
    private RecipeStepRepository recipeStepRepository;

    @Test
    void shouldSaveRecipeStep() {

        Recipe recipe = recipeRepository.save(
                new Recipe(
                        UUID.randomUUID(),
                        "Tortilla de patatas",
                        "Receta tradicional",
                        RecipeCategory.MAIN_COURSE
                )
        );

        RecipeVersion version = recipeVersionRepository.save(
                new RecipeVersion(
                        recipe,
                        1,
                        "Versión inicial",
                        null,
                        null
                )
        );

        RecipeStep step = new RecipeStep(
                version,
                1,
                "Pelar las patatas."
        );

        RecipeStep saved = recipeStepRepository.save(step);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getRecipeVersion().getId()).isEqualTo(version.getId());
        assertThat(saved.getOrder()).isEqualTo(1);
        assertThat(saved.getDescription()).isEqualTo("Pelar las patatas.");
    }

    @Test
    void shouldFindRecipeStepById() {

        Recipe recipe = recipeRepository.save(
                new Recipe(
                        UUID.randomUUID(),
                        "Paella",
                        "Receta familiar",
                        RecipeCategory.MAIN_COURSE
                )
        );

        RecipeVersion version = recipeVersionRepository.save(
                new RecipeVersion(
                        recipe,
                        1,
                        "Versión inicial",
                        null,
                        null
                )
        );

        RecipeStep saved = recipeStepRepository.save(
                new RecipeStep(
                        version,
                        1,
                        "Añadir el arroz."
                )
        );

        Optional<RecipeStep> result = recipeStepRepository.findById(saved.getId());

        assertThat(result).isPresent();
        assertThat(result.get().getDescription()).isEqualTo("Añadir el arroz.");
        assertThat(result.get().getOrder()).isEqualTo(1);
    }
}