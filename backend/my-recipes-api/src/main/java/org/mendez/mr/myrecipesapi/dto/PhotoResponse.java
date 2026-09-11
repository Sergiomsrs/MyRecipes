package org.mendez.mr.myrecipesapi.dto;

import java.util.UUID;

public record PhotoResponse(
        UUID id,
        String url,
        String caption
) {
}