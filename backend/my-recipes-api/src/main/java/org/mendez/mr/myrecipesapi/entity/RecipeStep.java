package org.mendez.mr.myrecipesapi.entity;


import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "recipe_steps", indexes = {
        @Index(
                name = "idx_recipe_step_recipe_version",
                columnList = "recipe_version_id"
        )
})
public class RecipeStep {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recipe_version_id", nullable = false)
    private RecipeVersion recipeVersion;

    @Column(name = "step_order", nullable = false)
    private Integer order;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    protected RecipeStep() {
    }

    public RecipeStep(
            RecipeVersion recipeVersion,
            Integer order,
            String description
    ) {
        this.recipeVersion = recipeVersion;
        this.order = order;
        this.description = description;
    }

    public RecipeStep(UUID id, RecipeVersion recipeVersion, Integer order, String description) {
        this.id = id;
        this.recipeVersion = recipeVersion;
        this.order = order;
        this.description = description;
    }

    public UUID getId() {
        return id;
    }

    public RecipeVersion getRecipeVersion() {
        return recipeVersion;
    }

    public Integer getOrder() {
        return order;
    }

    public String getDescription() {
        return description;
    }
}
