package org.mendez.mr.myrecipesapi.service;

import org.junit.jupiter.api.Test;
import org.mendez.mr.myrecipesapi.dto.CreatePhotoRequest;
import org.mendez.mr.myrecipesapi.dto.CreateRecipeIngredientRequest;
import org.mendez.mr.myrecipesapi.dto.CreateRecipeRequest;
import org.mendez.mr.myrecipesapi.dto.CreateRecipeStepRequest;
import org.mendez.mr.myrecipesapi.dto.PhotoResponse;
import org.mendez.mr.myrecipesapi.dto.RecipeIngredientResponse;
import org.mendez.mr.myrecipesapi.dto.RecipeResponse;
import org.mendez.mr.myrecipesapi.dto.RecipeStepResponse;
import org.mendez.mr.myrecipesapi.dto.RecipeWithCurrentVersionResponse;
import org.mendez.mr.myrecipesapi.entity.Recipe;
import org.mendez.mr.myrecipesapi.entity.RecipeIngredient;
import org.mendez.mr.myrecipesapi.entity.RecipeStep;
import org.mendez.mr.myrecipesapi.entity.RecipeVersion;
import org.mendez.mr.myrecipesapi.entity.User;
import org.mendez.mr.myrecipesapi.enums.RecipeCategory;
import org.mendez.mr.myrecipesapi.repository.RecipeRepository;
import org.mendez.mr.myrecipesapi.repository.RecipeVersionRepository;
import org.mendez.mr.myrecipesapi.repository.UserRepository;
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

    @Autowired
    private UserRepository userRepository;

    private UUID createUser() {
        User user = userRepository.save(new User(
                "user-" + UUID.randomUUID() + "@example.com",
                "password123"
        ));
        return user.getId();
    }

    private CreateRecipeRequest buildRequest() {
        return new CreateRecipeRequest(
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

    private RecipeWithCurrentVersionResponse entryOf(
            List<RecipeWithCurrentVersionResponse> entries,
            UUID recipeId
    ) {
        return entries.stream()
                .filter(entry -> entry.recipe().id().equals(recipeId))
                .findFirst()
                .orElseThrow();
    }

    @Test
    void shouldCreateRecipeWithInitialVersionAndContent() {

        UUID userId = createUser();

        RecipeResponse response = recipeService.createRecipe(buildRequest(), userId);

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

        UUID userId = createUser();

        recipeService.createRecipe(buildRequest(), userId);
        recipeService.createRecipe(buildRequest(), userId);

        List<RecipeResponse> recipes = recipeService.getRecipes(userId);

        assertThat(recipes).hasSize(2);
    }

    @Test
    void shouldGetRecipesWithTheirCurrentVersion() {

        UUID userId = createUser();

        RecipeResponse first = recipeService.createRecipe(buildRequest(), userId);
        RecipeResponse second = recipeService.createRecipe(
                new CreateRecipeRequest(
                        "Bizcocho de limón",
                        "Receta de sobremesa",
                        RecipeCategory.DESSERT,
                        "Versión inicial",
                        "Muy esponjoso",
                        9,
                        List.of(
                                new CreateRecipeIngredientRequest("Harina", new BigDecimal("250"), "g", 1),
                                new CreateRecipeIngredientRequest("Limón", new BigDecimal("2"), "unidad", 2)
                        ),
                        List.of(
                                new CreateRecipeStepRequest(1, "Mezclar los ingredientes."),
                                new CreateRecipeStepRequest(2, "Hornear 40 minutos.")
                        ),
                        List.of(
                                new CreatePhotoRequest("https://example.com/bizcocho.jpg", "Bizcocho recién horneado")
                        )
                ),
                userId
        );

        List<RecipeWithCurrentVersionResponse> entries =
                recipeService.getRecipesWithCurrentVersion(userId);

        assertThat(entries).hasSize(2);

        assertThat(entries)
                .extracting(entry -> entry.recipe().id())
                .containsExactlyInAnyOrder(first.id(), second.id());

        RecipeWithCurrentVersionResponse latestEntry = entryOf(entries, second.id());

        assertThat(latestEntry.recipe().title()).isEqualTo("Bizcocho de limón");
        assertThat(latestEntry.currentVersion()).isNotNull();
        assertThat(latestEntry.currentVersion().recipeId()).isEqualTo(second.id());
        assertThat(latestEntry.currentVersion().versionNumber()).isEqualTo(1);
        assertThat(latestEntry.currentVersion().rating()).isEqualTo(9);
        assertThat(latestEntry.currentVersion().notes()).isEqualTo("Muy esponjoso");
        assertThat(latestEntry.currentVersion().ingredients())
                .extracting(RecipeIngredientResponse::name)
                .containsExactly("Harina", "Limón");
        assertThat(latestEntry.currentVersion().steps())
                .extracting(RecipeStepResponse::description)
                .containsExactly("Mezclar los ingredientes.", "Hornear 40 minutos.");
        assertThat(latestEntry.currentVersion().photos())
                .extracting(PhotoResponse::url)
                .containsExactly("https://example.com/bizcocho.jpg");

        RecipeWithCurrentVersionResponse previousEntry = entryOf(entries, first.id());

        assertThat(previousEntry.currentVersion()).isNotNull();
        assertThat(previousEntry.currentVersion().recipeId()).isEqualTo(first.id());
        assertThat(previousEntry.currentVersion().ingredients())
                .extracting(RecipeIngredientResponse::name)
                .containsExactly("Patatas", "Huevos");
        assertThat(previousEntry.currentVersion().steps())
                .extracting(RecipeStepResponse::description)
                .containsExactly("Pelar y cortar las patatas.", "Freír las patatas.");
    }

    @Test
    void shouldReturnOnlyRecipesOfTheAuthenticatedUserWithCurrentVersion() {

        UUID userId = createUser();
        UUID otherUserId = createUser();

        recipeService.createRecipe(buildRequest(), userId);
        recipeService.createRecipe(buildRequest(), otherUserId);

        List<RecipeWithCurrentVersionResponse> entries =
                recipeService.getRecipesWithCurrentVersion(userId);

        assertThat(entries).hasSize(1);
        assertThat(entries.get(0).recipe().userId()).isEqualTo(userId);
    }

    @Test
    void shouldReturnEmptyListWhenUserHasNoRecipes() {

        List<RecipeWithCurrentVersionResponse> entries =
                recipeService.getRecipesWithCurrentVersion(UUID.randomUUID());

        assertThat(entries).isEmpty();
    }
}
