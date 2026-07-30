package org.mendez.mr.myrecipesapi.repository;


import org.junit.jupiter.api.Test;
import org.mendez.mr.myrecipesapi.entity.Recipe;
import org.mendez.mr.myrecipesapi.entity.RecipeVersion;
import org.mendez.mr.myrecipesapi.enums.RecipeCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class RecipeVersionRepositoryTest {


    @Autowired
    private RecipeVersionRepository recipeVersionRepository;

    @Autowired
    private RecipeRepository recipeRepository;



    @Test
    void shouldSaveRecipeVersion() {

        Recipe recipe = recipeRepository.save(
                new Recipe(
                        UUID.randomUUID(),
                        "Tortilla",
                        "Receta tradicional",
                        RecipeCategory.MAIN_COURSE
                )
        );

        RecipeVersion version = new RecipeVersion(
                recipe,
                1,
                "Versión inicial",
                "Primera prueba",
                8
        );

        RecipeVersion saved = recipeVersionRepository.save(version);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getCreatedAt()).isNotNull();
    }

    @Test
    void shouldAssociateVersionWithRecipe() {

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
                        "",
                        9
                )
        );

        RecipeVersion found =
                recipeVersionRepository.findById(version.getId()).orElseThrow();

        assertThat(found.getRecipe().getId())
                .isEqualTo(recipe.getId());
    }

    @Test
    void shouldFindAllVersionsOfRecipe() {

        Recipe recipe = recipeRepository.save(
                new Recipe(
                        UUID.randomUUID(),
                        "Pizza",
                        "Receta italiana",
                        RecipeCategory.MAIN_COURSE
                )
        );

        recipeVersionRepository.save(
                new RecipeVersion(recipe, 1, "Inicial", "", 7)
        );

        recipeVersionRepository.save(
                new RecipeVersion(recipe, 2, "Más queso", "", 8)
        );

        recipeVersionRepository.save(
                new RecipeVersion(recipe, 3, "Nuevo horneado", "", 9)
        );

        List<RecipeVersion> versions =
                recipeVersionRepository.findByRecipeId(recipe.getId());

        assertThat(versions).hasSize(3);
    }




}
