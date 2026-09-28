package org.mendez.mr.myrecipesapi.dto;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.mendez.mr.myrecipesapi.enums.RecipeCategory;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class RecipeRequestValidationTest {

    private static final int MAX_INGREDIENTS = 50;
    private static final int MAX_STEPS = 50;
    private static final int MAX_PHOTOS = 12;

    private static ValidatorFactory validatorFactory;
    private static Validator validator;

    @BeforeAll
    static void setUpValidator() {
        validatorFactory = Validation.buildDefaultValidatorFactory();
        validator = validatorFactory.getValidator();
    }

    @AfterAll
    static void closeValidator() {
        validatorFactory.close();
    }

    @Test
    void aceptaUnaRecetaEnElLimite() {
        assertThat(validator.validate(recipe(MAX_INGREDIENTS, MAX_STEPS, MAX_PHOTOS))).isEmpty();
    }

    @Test
    void rechazaDemasiadosIngredientes() {
        assertThat(validator.validate(recipe(MAX_INGREDIENTS + 1, MAX_STEPS, MAX_PHOTOS)))
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("ingredients"));
    }

    @Test
    void rechazaDemasiadosPasos() {
        assertThat(validator.validate(recipe(MAX_INGREDIENTS, MAX_STEPS + 1, MAX_PHOTOS)))
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("steps"));
    }

    @Test
    void rechazaDemasiadasFotos() {
        assertThat(validator.validate(recipe(MAX_INGREDIENTS, MAX_STEPS, MAX_PHOTOS + 1)))
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("photos"));
    }

    @Test
    void rechazaListasVacias() {
        assertThat(validator.validate(recipe(0, MAX_STEPS, MAX_PHOTOS)))
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("ingredients"));
        assertThat(validator.validate(recipe(MAX_INGREDIENTS, 0, MAX_PHOTOS)))
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("steps"));
    }

    @Test
    void aceptaRecetaSinFotos() {
        assertThat(validator.validate(recipe(1, 1, null))).isEmpty();
    }

    @Test
    void aceptaUnaVersionEnElLimite() {
        assertThat(validator.validate(version(MAX_INGREDIENTS, MAX_STEPS, MAX_PHOTOS))).isEmpty();
    }

    @Test
    void rechazaUnaVersionQueSuperaLosLimites() {
        assertThat(validator.validate(version(MAX_INGREDIENTS + 1, MAX_STEPS, MAX_PHOTOS)))
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("ingredients"));
        assertThat(validator.validate(version(MAX_INGREDIENTS, MAX_STEPS + 1, MAX_PHOTOS)))
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("steps"));
        assertThat(validator.validate(version(MAX_INGREDIENTS, MAX_STEPS, MAX_PHOTOS + 1)))
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("photos"));
    }

    private CreateRecipeRequest recipe(int ingredientCount, int stepCount, Integer photoCount) {
        return new CreateRecipeRequest(
                "Spaghetti a la carbonara",
                "Pasta con salsa de huevo",
                RecipeCategory.MAIN_COURSE,
                "Versión inicial",
                "Servir bien caliente",
                9,
                ingredients(ingredientCount),
                steps(stepCount),
                photoCount == null ? null : photos(photoCount)
        );
    }

    private CreateVersionRequest version(int ingredientCount, int stepCount, Integer photoCount) {
        return new CreateVersionRequest(
                "Ajusté la salsa",
                "Más pecorino",
                8,
                ingredients(ingredientCount),
                steps(stepCount),
                photoCount == null ? null : photos(photoCount)
        );
    }

    private List<CreateRecipeIngredientRequest> ingredients(int count) {
        List<CreateRecipeIngredientRequest> ingredients = new ArrayList<>(count);
        for (int i = 0; i < count; i++) {
            ingredients.add(new CreateRecipeIngredientRequest(
                    "Ingrediente " + i,
                    new BigDecimal("100"),
                    "g",
                    i
            ));
        }
        return ingredients;
    }

    private List<CreateRecipeStepRequest> steps(int count) {
        List<CreateRecipeStepRequest> steps = new ArrayList<>(count);
        for (int i = 0; i < count; i++) {
            steps.add(new CreateRecipeStepRequest(i, "Paso " + i));
        }
        return steps;
    }

    private List<CreatePhotoRequest> photos(int count) {
        List<CreatePhotoRequest> photos = new ArrayList<>(count);
        for (int i = 0; i < count; i++) {
            photos.add(new CreatePhotoRequest("https://ejemplo.com/foto-" + i + ".jpg", "Foto " + i));
        }
        return photos;
    }
}
