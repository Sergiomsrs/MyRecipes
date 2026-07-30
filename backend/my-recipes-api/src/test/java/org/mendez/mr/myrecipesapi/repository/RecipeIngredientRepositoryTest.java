package org.mendez.mr.myrecipesapi.repository;

import org.junit.jupiter.api.Test;
import org.mendez.mr.myrecipesapi.entity.Recipe;
import org.mendez.mr.myrecipesapi.entity.RecipeIngredient;
import org.mendez.mr.myrecipesapi.entity.RecipeVersion;
import org.mendez.mr.myrecipesapi.enums.RecipeCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class RecipeIngredientRepositoryTest {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private RecipeVersionRepository recipeVersionRepository;

    @Autowired
    private RecipeIngredientRepository recipeIngredientRepository;

    @Test
    void shouldSaveRecipeIngredient() {

        Recipe recipe = recipeRepository.save(
                new Recipe(
                        UUID.randomUUID(),
                        "Tortilla",
                        "Receta tradicional",
                        RecipeCategory.MAIN_COURSE
                )
        );

        RecipeVersion version = recipeVersionRepository.save(
                new RecipeVersion(
                        recipe,
                        1,
                        "Versión inicial",
                        "",
                        8
                )
        );

        RecipeIngredient ingredient = new RecipeIngredient(
                version,
                "Patatas",
                new BigDecimal("500"),
                "g",
                1
        );

        RecipeIngredient saved = recipeIngredientRepository.save(ingredient);

        assertThat(saved.getId()).isNotNull();
    }

    @Test
    void shouldAssociateIngredientWithRecipeVersion() {

        Recipe recipe = recipeRepository.save(
                new Recipe(
                        UUID.randomUUID(),
                        "Tortilla",
                        "Receta tradicional",
                        RecipeCategory.MAIN_COURSE
                )
        );

        RecipeVersion version = recipeVersionRepository.save(
                new RecipeVersion(
                        recipe,
                        1,
                        "Versión inicial",
                        "",
                        8
                )
        );

        RecipeIngredient ingredient = recipeIngredientRepository.save(
                new RecipeIngredient(
                        version,
                        "Huevos",
                        new BigDecimal("4"),
                        "unidad",
                        1
                )
        );

        RecipeIngredient found = recipeIngredientRepository
                .findById(ingredient.getId())
                .orElseThrow();

        assertThat(found.getRecipeVersion().getId())
                .isEqualTo(version.getId());
    }

    @Test
    void shouldFindIngredientsOrderedByOrderIndex() {

        Recipe recipe = recipeRepository.save(
                new Recipe(
                        UUID.randomUUID(),
                        "Pan",
                        "Receta básica",
                        RecipeCategory.MAIN_COURSE
                )
        );

        RecipeVersion version = recipeVersionRepository.save(
                new RecipeVersion(
                        recipe,
                        1,
                        "Versión inicial",
                        "",
                        7
                )
        );

        recipeIngredientRepository.save(
                new RecipeIngredient(
                        version,
                        "Sal",
                        new BigDecimal("10"),
                        "g",
                        2
                )
        );

        recipeIngredientRepository.save(
                new RecipeIngredient(
                        version,
                        "Harina",
                        new BigDecimal("500"),
                        "g",
                        1
                )
        );

        recipeIngredientRepository.save(
                new RecipeIngredient(
                        version,
                        "Agua",
                        new BigDecimal("300"),
                        "ml",
                        3
                )
        );

        List<RecipeIngredient> ingredients =
                recipeIngredientRepository.findByRecipeVersionIdOrderByOrderIndex(version.getId());

        assertThat(ingredients).hasSize(3);
        assertThat(ingredients.get(0).getName()).isEqualTo("Harina");
        assertThat(ingredients.get(1).getName()).isEqualTo("Sal");
        assertThat(ingredients.get(2).getName()).isEqualTo("Agua");
    }
}