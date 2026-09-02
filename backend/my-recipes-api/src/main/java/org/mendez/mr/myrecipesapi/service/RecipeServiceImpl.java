package org.mendez.mr.myrecipesapi.service;

import org.mendez.mr.myrecipesapi.dto.CreateRecipeRequest;
import org.mendez.mr.myrecipesapi.entity.Recipe;
import org.mendez.mr.myrecipesapi.entity.RecipeVersion;
import org.mendez.mr.myrecipesapi.repository.RecipeRepository;
import org.mendez.mr.myrecipesapi.repository.RecipeVersionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public Recipe createRecipe(CreateRecipeRequest request) {

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

        version = recipeVersionRepository.save(version);

        recipe.setCurrentVersionId(version.getId());

        return recipeRepository.save(recipe);
    }
}
