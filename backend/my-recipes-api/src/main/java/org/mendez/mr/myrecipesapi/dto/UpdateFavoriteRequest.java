package org.mendez.mr.myrecipesapi.dto;

import jakarta.validation.constraints.NotNull;

public record UpdateFavoriteRequest(

        @NotNull(message = "favorite es obligatorio")
        Boolean favorite

) {
}