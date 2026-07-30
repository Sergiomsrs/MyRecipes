package org.mendez.mr.myrecipesapi.entity;


import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "recipe_ingredients")
public class RecipeIngredient {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recipe_version_id", nullable = false)
    private RecipeVersion recipeVersion;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal quantity;

    @Column(nullable = false)
    private String unit;

    @Column(nullable = false)
    private Integer orderIndex;

    protected RecipeIngredient() {
    }

    public RecipeIngredient(
            RecipeVersion recipeVersion,
            String name,
            BigDecimal quantity,
            String unit,
            Integer orderIndex
    ) {
        this.recipeVersion = recipeVersion;
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.orderIndex = orderIndex;
    }

    public UUID getId() {
        return id;
    }

    public RecipeVersion getRecipeVersion() {
        return recipeVersion;
    }

    public String getName() {
        return name;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public String getUnit() {
        return unit;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }
}
