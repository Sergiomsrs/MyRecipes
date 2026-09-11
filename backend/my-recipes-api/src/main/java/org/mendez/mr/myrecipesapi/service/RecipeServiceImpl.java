package org.mendez.mr.myrecipesapi.service;

import org.mendez.mr.myrecipesapi.dto.CreatePhotoRequest;
import org.mendez.mr.myrecipesapi.dto.CreateRecipeIngredientRequest;
import org.mendez.mr.myrecipesapi.dto.CreateRecipeRequest;
import org.mendez.mr.myrecipesapi.dto.CreateRecipeStepRequest;
import org.mendez.mr.myrecipesapi.dto.RecipeResponse;
import org.mendez.mr.myrecipesapi.dto.UpdateRecipeRequest;
import org.mendez.mr.myrecipesapi.entity.Photo;
import org.mendez.mr.myrecipesapi.entity.Recipe;
import org.mendez.mr.myrecipesapi.entity.RecipeIngredient;
import org.mendez.mr.myrecipesapi.entity.RecipeStep;
import org.mendez.mr.myrecipesapi.entity.RecipeVersion;
import org.mendez.mr.myrecipesapi.exception.ResourceNotFoundException;
import org.mendez.mr.myrecipesapi.mapper.RecipeMapper;
import org.mendez.mr.myrecipesapi.repository.RecipeRepository;
import org.mendez.mr.myrecipesapi.repository.RecipeVersionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class RecipeServiceImpl implements RecipeService {

    private final RecipeRepository recipeRepository;
    private final RecipeVersionRepository recipeVersionRepository;

    public RecipeServiceImpl(
            RecipeRepository recipeRepository,
            RecipeVersionRepository recipeVersionRepository
    ) {
        this.recipeRepository = recipeRepository;
        this.recipeVersionRepository = recipeVersionRepository;
    }

    @Override
    public List<RecipeResponse> getRecipes(UUID userId) {
        return RecipeMapper.toResponse(
                recipeRepository.findByUserIdOrderByUpdatedAtDesc(userId)
        );
    }

    @Override
    public RecipeResponse getRecipe(UUID recipeId, UUID userId) {
        return RecipeMapper.toResponse(findOwned(recipeId, userId));
    }

    @Override
    public RecipeResponse createRecipe(CreateRecipeRequest request) {

        Recipe recipe = new Recipe(
                request.userId(),
                request.title(),
                request.description(),
                request.category()
        );

        recipe = recipeRepository.save(recipe);

        RecipeVersion version = new RecipeVersion(
                recipe,
                1,
                request.summaryChanges(),
                request.notes(),
                request.rating()
        );

        for (CreateRecipeIngredientRequest ingredient : request.ingredients()) {
            version.addIngredient(new RecipeIngredient(
                    version,
                    ingredient.name(),
                    ingredient.quantity(),
                    ingredient.unit(),
                    ingredient.orderIndex()
            ));
        }

        for (CreateRecipeStepRequest step : request.steps()) {
            version.addStep(new RecipeStep(
                    version,
                    step.order(),
                    step.description()
            ));
        }

        if (request.photos() != null) {
            for (CreatePhotoRequest photo : request.photos()) {
                version.addPhoto(new Photo(
                        version,
                        photo.url(),
                        photo.caption()
                ));
            }
        }

        version = recipeVersionRepository.save(version);

        recipe.setCurrentVersionId(version.getId());

        return RecipeMapper.toResponse(recipeRepository.save(recipe));
    }

    @Override
    public RecipeResponse updateRecipe(UUID recipeId, UpdateRecipeRequest request) {

        Recipe recipe = findOwned(recipeId, request.userId());

        recipe.setTitle(request.title());
        recipe.setDescription(request.description());
        recipe.setCategory(request.category());

        return RecipeMapper.toResponse(recipeRepository.save(recipe));
    }

    @Override
    public void deleteRecipe(UUID recipeId, UUID userId) {

        Recipe recipe = findOwned(recipeId, userId);

        List<RecipeVersion> versions =
                recipeVersionRepository.findByRecipeId(recipeId);

        recipeVersionRepository.deleteAll(versions);
        recipeRepository.delete(recipe);
    }

    private Recipe findOwned(UUID recipeId, UUID userId) {
        return recipeRepository.findByIdAndUserId(recipeId, userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Recipe not found with id " + recipeId
                ));
    }
}