package org.mendez.mr.myrecipesapi.repository;

import org.mendez.mr.myrecipesapi.entity.Photo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface PhotoRepository extends JpaRepository<Photo, UUID> {

    List<Photo> findByRecipeVersionIdIn(Collection<UUID> recipeVersionIds);

}
