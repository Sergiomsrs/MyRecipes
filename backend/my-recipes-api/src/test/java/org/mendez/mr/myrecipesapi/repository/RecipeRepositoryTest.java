package org.mendez.mr.myrecipesapi.repository;

import org.junit.jupiter.api.Test;
import org.mendez.mr.myrecipesapi.entity.Recipe;
import org.mendez.mr.myrecipesapi.entity.RecipeVersion;
import org.mendez.mr.myrecipesapi.enums.RecipeCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@DataJpaTest
class RecipeRepositoryTest {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private RecipeVersionRepository recipeVersionRepository;

    @Test
    void shouldSaveRecipe() {

        Recipe recipe = new Recipe(
                UUID.randomUUID(),
                "Tortilla de patatas",
                "Receta tradicional",
                RecipeCategory.MAIN_COURSE
        );

        Recipe saved = recipeRepository.save(recipe);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getCreatedAt()).isNotNull();
        assertThat(saved.getUpdatedAt()).isNotNull();
    }

    @Test
    void shouldFindRecipeById() {

        Recipe recipe = recipeRepository.save(
                new Recipe(
                        UUID.randomUUID(),
                        "Paella",
                        "Receta familiar",
                        RecipeCategory.SAUCE
                )
        );

        Optional<Recipe> result = recipeRepository.findById(recipe.getId());

        assertThat(result).isPresent();
        assertThat(result.get().getTitle()).isEqualTo("Paella");
    }




}
