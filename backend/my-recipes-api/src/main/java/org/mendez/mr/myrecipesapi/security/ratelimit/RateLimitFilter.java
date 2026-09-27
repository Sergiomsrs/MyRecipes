package org.mendez.mr.myrecipesapi.security.ratelimit;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.mendez.mr.myrecipesapi.dto.ApiErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Limita el número de peticiones por IP sobre /api/auth/** (login y registro)
 * para mitigar fuerza bruta. Ventana deslizante en memoria, sin dependencias.
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RateLimitFilter.class);
    private static final String AUTH_PREFIX = "/api/auth/";
    private static final int MAX_TRACKED_KEYS = 10_000;

    private final ObjectMapper objectMapper;
    private final boolean enabled;
    private final int limit;
    private final long windowMs;
    private final Map<String, Deque<Long>> windows = new ConcurrentHashMap<>();

    public RateLimitFilter(
            ObjectMapper objectMapper,
            @Value("${rate-limit.auth.enabled:true}") boolean enabled,
            @Value("${rate-limit.auth.limit:10}") int limit,
            @Value("${rate-limit.auth.window-ms:60000}") long windowMs
    ) {
        this.objectMapper = objectMapper;
        this.enabled = enabled;
        this.limit = limit;
        this.windowMs = windowMs;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String uri = request.getRequestURI();
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }
        return !enabled || !uri.startsWith(AUTH_PREFIX);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String key = clientKey(request);
        long now = System.currentTimeMillis();

        Deque<Long> window = windows.computeIfAbsent(key, k -> new ArrayDeque<>());

        boolean rejected;
        Long oldest;
        synchronized (window) {
            while (!window.isEmpty() && now - window.peekFirst() >= windowMs) {
                window.pollFirst();
            }

            rejected = window.size() >= limit;
            oldest = window.peekFirst();
            if (!rejected) {
                window.addLast(now);
            }
        }

        if (windows.size() > MAX_TRACKED_KEYS) {
            evictStaleWindows(now);
        }

        if (rejected) {
            long retryAfterMs = oldest == null ? windowMs : Math.max(1, windowMs - (now - oldest));
            log.warn("Rate limit superado para {} en {}", key, request.getRequestURI());
            writeTooManyRequests(request, response, retryAfterMs);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void evictStaleWindows(long now) {
        windows.entrySet().removeIf(entry -> {
            Deque<Long> window = entry.getValue();
            synchronized (window) {
                while (!window.isEmpty() && now - window.peekFirst() >= windowMs) {
                    window.pollFirst();
                }
                return window.isEmpty();
            }
        });
    }

    private String clientKey(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            String[] hops = forwarded.split(",");
            for (int i = hops.length - 1; i >= 0; i--) {
                String hop = hops[i].trim();
                if (!hop.isEmpty()) {
                    return hop;
                }
            }
        }
        return request.getRemoteAddr();
    }

    private void writeTooManyRequests(HttpServletRequest request,
                                       HttpServletResponse response,
                                       long retryAfterMs) throws IOException {
        ApiErrorResponse body = new ApiErrorResponse(
                Instant.now(),
                429,
                "Too Many Requests",
                "Demasiadas peticiones. Inténtalo de nuevo en unos segundos",
                request.getRequestURI()
        );

        response.setStatus(429);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Retry-After", String.valueOf(Math.max(1, retryAfterMs / 1000)));
        response.getWriter().write(objectMapper.writeValueAsString(body));
    }
}
