package org.mendez.mr.myrecipesapi.entity;


import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "photos", indexes = {
        @Index(name = "idx_photo_recipe_version", columnList = "recipe_version_id")
})
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recipe_version_id", nullable = false)
    private RecipeVersion recipeVersion;

    @Column(nullable = false)
    private String url;

    @Column(length = 255)
    private String caption;

    protected Photo() {
    }

    public Photo(
            RecipeVersion recipeVersion,
            String url,
            String caption
    ) {
        this.recipeVersion = recipeVersion;
        this.url = url;
        this.caption = caption;
    }

    public UUID getId() {
        return id;
    }

    public RecipeVersion getRecipeVersion() {
        return recipeVersion;
    }

    public String getUrl() {
        return url;
    }

    public String getCaption() {
        return caption;
    }
}
