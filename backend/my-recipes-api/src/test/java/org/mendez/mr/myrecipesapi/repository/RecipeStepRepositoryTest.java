package org.mendez.mr.myrecipesapi.repository;

import org.junit.jupiter.api.Test;
import org.mendez.mr.myrecipesapi.entity.Recipe;
import org.mendez.mr.myrecipesapi.entity.RecipeStep;
import org.mendez.mr.myrecipesapi.entity.RecipeVersion;
import org.mendez.mr.myrecipesapi.enums.RecipeCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

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

    @Test
    void shouldFindStepsOfSeveralVersionsOrderedByOrder() {

        Recipe firstRecipe = recipeRepository.save(
                new Recipe(
                        UUID.randomUUID(),
                        "Tortilla de patatas",
                        "Receta tradicional",
                        RecipeCategory.MAIN_COURSE
                )
        );

        Recipe secondRecipe = recipeRepository.save(
                new Recipe(
                        UUID.randomUUID(),
                        "Paella",
                        "Receta familiar",
                        RecipeCategory.MAIN_COURSE
                )
        );

        RecipeVersion firstVersion = recipeVersionRepository.save(
                new RecipeVersion(firstRecipe, 1, "Versión inicial", null, null)
        );

        RecipeVersion secondVersion = recipeVersionRepository.save(
                new RecipeVersion(secondRecipe, 1, "Versión inicial", null, null)
        );

        recipeStepRepository.save(new RecipeStep(firstVersion, 2, "Freír las patatas."));
        recipeStepRepository.save(new RecipeStep(firstVersion, 1, "Pelar las patatas."));
        recipeStepRepository.save(new RecipeStep(secondVersion, 1, "Sofreír el arroz."));

        List<RecipeStep> steps = recipeStepRepository.findByRecipeVersionIdInOrderByOrder(
                List.of(firstVersion.getId(), secondVersion.getId())
        );

        assertThat(steps).hasSize(3);

        Map<UUID, List<String>> descriptionsByVersionId = steps.stream().collect(
                Collectors.groupingBy(
                        step -> step.getRecipeVersion().getId(),
                        LinkedHashMap::new,
                        Collectors.mapping(RecipeStep::getDescription, Collectors.toList())
                )
        );

        assertThat(descriptionsByVersionId.get(firstVersion.getId()))
                .containsExactly("Pelar las patatas.", "Freír las patatas.");
        assertThat(descriptionsByVersionId.get(secondVersion.getId()))
                .containsExactly("Sofreír el arroz.");
    }

    @Test
    void shouldNotFindStepsWhenNoVersionIdsAreProvided() {

        List<RecipeStep> steps =
                recipeStepRepository.findByRecipeVersionIdInOrderByOrder(List.of());

        assertThat(steps).isEmpty();
    }
}
