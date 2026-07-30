package org.mendez.mr.myrecipesapi.entity;


import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "recipe_versions")
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

    public Instant getCreatedAt() {
        return createdAt;
    }
}
