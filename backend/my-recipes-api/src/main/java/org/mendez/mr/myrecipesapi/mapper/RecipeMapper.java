package org.mendez.mr.myrecipesapi.mapper;

import org.mendez.mr.myrecipesapi.dto.PhotoResponse;
import org.mendez.mr.myrecipesapi.dto.RecipeIngredientResponse;
import org.mendez.mr.myrecipesapi.dto.RecipeResponse;
import org.mendez.mr.myrecipesapi.dto.RecipeStepResponse;
import org.mendez.mr.myrecipesapi.dto.RecipeVersionResponse;
import org.mendez.mr.myrecipesapi.entity.Photo;
import org.mendez.mr.myrecipesapi.entity.Recipe;
import org.mendez.mr.myrecipesapi.entity.RecipeIngredient;
import org.mendez.mr.myrecipesapi.entity.RecipeStep;
import org.mendez.mr.myrecipesapi.entity.RecipeVersion;

import java.util.List;

public final class RecipeMapper {

    private RecipeMapper() {
    }

    public static RecipeResponse toResponse(Recipe recipe) {
        return new RecipeResponse(
                recipe.getId(),
                recipe.getUserId(),
                recipe.getTitle(),
                recipe.getDescription(),
                recipe.getCategory(),
                recipe.getCurrentVersionId(),
                recipe.getCreatedAt(),
                recipe.getUpdatedAt()
        );
    }

    public static List<RecipeResponse> toResponse(List<Recipe> recipes) {
        return recipes.stream().map(RecipeMapper::toResponse).toList();
    }

    public static RecipeVersionResponse toVersionResponse(RecipeVersion version) {
        return new RecipeVersionResponse(
                version.getId(),
                version.getRecipe().getId(),
                version.getVersionNumber(),
                version.getSummaryChanges(),
                version.getNotes(),
                version.getRating(),
                version.getCreatedAt(),
                toIngredientResponse(version.getIngredients()),
                toStepResponse(version.getSteps()),
                toPhotoResponse(version.getPhotos())
        );
    }

    public static List<RecipeVersionResponse> toVersionResponse(List<RecipeVersion> versions) {
        return versions.stream().map(RecipeMapper::toVersionResponse).toList();
    }

    public static List<RecipeIngredientResponse> toIngredientResponse(List<RecipeIngredient> ingredients) {
        return ingredients.stream().map(RecipeMapper::toIngredientResponse).toList();
    }

    public static RecipeIngredientResponse toIngredientResponse(RecipeIngredient ingredient) {
        return new RecipeIngredientResponse(
                ingredient.getId(),
                ingredient.getName(),
                ingredient.getQuantity(),
                ingredient.getUnit(),
                ingredient.getOrderIndex()
        );
    }

    public static List<RecipeStepResponse> toStepResponse(List<RecipeStep> steps) {
        return steps.stream().map(RecipeMapper::toStepResponse).toList();
    }

    public static RecipeStepResponse toStepResponse(RecipeStep step) {
        return new RecipeStepResponse(step.getId(), step.getOrder(), step.getDescription());
    }

    public static List<PhotoResponse> toPhotoResponse(List<Photo> photos) {
        return photos.stream().map(RecipeMapper::toPhotoResponse).toList();
    }

    public static PhotoResponse toPhotoResponse(Photo photo) {
        return new PhotoResponse(photo.getId(), photo.getUrl(), photo.getCaption());
    }
}