package org.mendez.mr.myrecipesapi.service;

import org.mendez.mr.myrecipesapi.dto.CreatePhotoRequest;
import org.mendez.mr.myrecipesapi.dto.CreateRecipeIngredientRequest;
import org.mendez.mr.myrecipesapi.dto.CreateRecipeRequest;
import org.mendez.mr.myrecipesapi.dto.CreateRecipeStepRequest;
import org.mendez.mr.myrecipesapi.dto.CreateVersionRequest;
import org.mendez.mr.myrecipesapi.dto.RecipeResponse;
import org.mendez.mr.myrecipesapi.dto.RecipeVersionResponse;
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
    public RecipeResponse createRecipe(CreateRecipeRequest request, UUID userId) {

        Recipe recipe = new Recipe(
                userId,
                request.title(),
                request.description(),
                request.category()
        );

        recipe = recipeRepository.save(recipe);

        RecipeVersion version = createFirstVersion(recipe, request);

        version = recipeVersionRepository.save(version);

        recipe.setCurrentVersionId(version.getId());

        return RecipeMapper.toResponse(recipeRepository.save(recipe));
    }

    @Override
    public RecipeResponse updateRecipe(UUID recipeId, UpdateRecipeRequest request, UUID userId) {

        Recipe recipe = findOwned(recipeId, userId);

        recipe.setTitle(request.title());
        recipe.setDescription(request.description());
        recipe.setCategory(request.category());

        return RecipeMapper.toResponse(recipeRepository.save(recipe));
    }

    @Override
    public RecipeVersionResponse getCurrentVersion(UUID recipeId, UUID userId) {

        Recipe recipe = findOwned(recipeId, userId);

        RecipeVersion version = recipeVersionRepository
                .findById(recipe.getCurrentVersionId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Version not found for recipe with id " + recipeId
                ));

        return RecipeMapper.toVersionResponse(version);
    }

    @Override
    public RecipeVersionResponse createVersion(UUID recipeId, CreateVersionRequest request, UUID userId) {

        Recipe recipe = findOwned(recipeId, userId);

        List<RecipeVersion> existingVersions =
                recipeVersionRepository.findByRecipeIdOrderByVersionNumber(recipeId);

        int nextVersionNumber = existingVersions.isEmpty()
                ? 1
                : existingVersions.get(existingVersions.size() - 1).getVersionNumber() + 1;

        RecipeVersion version = new RecipeVersion(
                recipe,
                nextVersionNumber,
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
        recipeRepository.save(recipe);

        return RecipeMapper.toVersionResponse(version);
    }

    @Override
    public void deleteRecipe(UUID recipeId, UUID userId) {

        Recipe recipe = findOwned(recipeId, userId);

        List<RecipeVersion> versions =
                recipeVersionRepository.findByRecipeId(recipeId);

        recipeVersionRepository.deleteAll(versions);
        recipeRepository.delete(recipe);
    }

    @Override
    public List<RecipeVersionResponse> getVersions(UUID recipeId, UUID userId) {

        findOwned(recipeId, userId);

        List<RecipeVersion> versions =
                recipeVersionRepository.findByRecipeIdOrderByVersionNumber(recipeId);

        return RecipeMapper.toVersionResponse(versions);
    }

    private Recipe findOwned(UUID recipeId, UUID userId) {
        return recipeRepository.findByIdAndUserId(recipeId, userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Recipe not found with id " + recipeId
                ));
    }

    private RecipeVersion createFirstVersion(Recipe recipe, CreateRecipeRequest request) {
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

        return version;
    }
}
