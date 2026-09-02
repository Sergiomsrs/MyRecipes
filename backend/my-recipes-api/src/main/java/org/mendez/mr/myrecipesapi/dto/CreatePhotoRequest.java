package org.mendez.mr.myrecipesapi.dto;

public record CreatePhotoRequest(
        String url,
        String caption
) {
}