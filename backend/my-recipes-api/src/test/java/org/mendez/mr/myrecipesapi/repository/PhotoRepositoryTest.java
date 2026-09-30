package org.mendez.mr.myrecipesapi.repository;

import org.junit.jupiter.api.Test;
import org.mendez.mr.myrecipesapi.entity.Photo;
import org.mendez.mr.myrecipesapi.entity.Recipe;
import org.mendez.mr.myrecipesapi.entity.RecipeVersion;
import org.mendez.mr.myrecipesapi.enums.RecipeCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class PhotoRepositoryTest {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private RecipeVersionRepository recipeVersionRepository;

    @Autowired
    private PhotoRepository photoRepository;

    @Test
    void shouldSavePhoto() {

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
                        null,
                        null
                )
        );

        Photo photo = new Photo(
                version,
                "https://example.com/photo.jpg",
                "Resultado final"
        );

        Photo saved = photoRepository.save(photo);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getRecipeVersion().getId()).isEqualTo(version.getId());
        assertThat(saved.getUrl()).isEqualTo("https://example.com/photo.jpg");
        assertThat(saved.getCaption()).isEqualTo("Resultado final");
    }

    @Test
    void shouldFindPhotoById() {

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

        Photo saved = photoRepository.save(
                new Photo(
                        version,
                        "https://example.com/paella.jpg",
                        "Paella terminada"
                )
        );

        Optional<Photo> result = photoRepository.findById(saved.getId());

        assertThat(result).isPresent();
        assertThat(result.get().getUrl()).isEqualTo("https://example.com/paella.jpg");
        assertThat(result.get().getCaption()).isEqualTo("Paella terminada");
    }

    @Test
    void shouldFindPhotosOfSeveralVersions() {

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

        photoRepository.save(new Photo(firstVersion, "https://example.com/tortilla.jpg", null));
        photoRepository.save(new Photo(secondVersion, "https://example.com/paella.jpg", "Terminada"));

        List<Photo> photos = photoRepository.findByRecipeVersionIdIn(
                List.of(firstVersion.getId(), secondVersion.getId())
        );

        assertThat(photos).hasSize(2);
        assertThat(photos)
                .extracting(Photo::getUrl)
                .containsExactlyInAnyOrder(
                        "https://example.com/tortilla.jpg",
                        "https://example.com/paella.jpg"
                );
    }

    @Test
    void shouldNotFindPhotosWhenNoVersionIdsAreProvided() {

        List<Photo> photos = photoRepository.findByRecipeVersionIdIn(List.of());

        assertThat(photos).isEmpty();
    }
}
