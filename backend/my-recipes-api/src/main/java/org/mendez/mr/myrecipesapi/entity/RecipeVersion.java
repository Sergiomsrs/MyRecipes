package org.mendez.mr.myrecipesapi.entity;


import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "recipe_versions", indexes = {
        @Index(name = "idx_recipe_version_recipe", columnList = "recipe_id")
})
@EntityListeners(AuditingEntityListener.class)
public class RecipeVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    @Column(nullable = false)
    private Integer versionNumber;

    @Column(length = 500)
    private String summaryChanges;

    @Column(length = 1000)
    private String notes;

    private Integer rating;

    @OneToMany(
            mappedBy = "recipeVersion",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @OrderBy("orderIndex ASC")
    private List<RecipeIngredient> ingredients = new ArrayList<>();

    @OneToMany(
            mappedBy = "recipeVersion",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @OrderBy("order ASC")
    private List<RecipeStep> steps = new ArrayList<>();


    @OneToMany(
            mappedBy = "recipeVersion",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Photo> photos = new ArrayList<>();


    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    protected RecipeVersion() {
    }

    public RecipeVersion(
            Recipe recipe,
            Integer versionNumber,
            String summaryChanges,
            String notes,
            Integer rating
    ) {
        this.recipe = recipe;
        this.versionNumber = versionNumber;
        this.summaryChanges = summaryChanges;
        this.notes = notes;
        this.rating = rating;
    }

    public UUID getId() {
        return id;
    }

    public Recipe getRecipe() {
        return recipe;
    }

    public Integer getVersionNumber() {
        return versionNumber;
    }

    public String getSummaryChanges() {
        return summaryChanges;
    }

    public String getNotes() {
        return notes;
    }

    public Integer getRating() {
        return rating;
    }

    public List<RecipeIngredient> getIngredients() {
        return ingredients;
    }

    public List<RecipeStep> getSteps() {
        return steps;
    }

    public List<Photo> getPhotos() {
        return photos;
    }

    public void addIngredient(RecipeIngredient ingredient) {
        ingredients.add(ingredient);
    }

    public void addStep(RecipeStep step) {
        steps.add(step);
    }

    public void addPhoto(Photo photo) {
        photos.add(photo);
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
