package org.mendez.mr.myrecipesapi.security.ratelimit;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import org.mendez.mr.myrecipesapi.dto.ApiErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Limita el número de peticiones por cliente sobre /api/auth/** (login y registro)
 * para mitigar fuerza bruta. Ventana deslizante en memoria, sin dependencias.
 *
 * La clave se calcula con el peer real de la conexión (desenvolviendo la petición
 * hasta la original, para no depender del orden respecto a ForwardedHeaderFilter) y
 * X-Forwarded-For solo se usa cuando ese peer es un proxy de confianza, de forma que
 * una cabecera manipulada por el cliente no sirve para esquivar el límite.
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RateLimitFilter.class);
    private static final String AUTH_PREFIX = "/api/auth/";
    private static final int MAX_TRACKED_KEYS = 10_000;
    private static final int MAX_UNWRAP_DEPTH = 16;
    private static final String DEFAULT_TRUSTED_PROXIES =
            "127.0.0.0/8,::1,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,fc00::/7";

    private final ObjectMapper objectMapper;
    private final boolean enabled;
    private final int limit;
    private final long windowMs;
    private final List<IpRange> trustedProxies;
    private final Map<String, Deque<Long>> windows = new ConcurrentHashMap<>();

    public RateLimitFilter(
            ObjectMapper objectMapper,
            @Value("${rate-limit.auth.enabled:true}") boolean enabled,
            @Value("${rate-limit.auth.limit:10}") int limit,
            @Value("${rate-limit.auth.window-ms:60000}") long windowMs,
            @Value("${rate-limit.auth.trusted-proxies:" + DEFAULT_TRUSTED_PROXIES + "}") String trustedProxies
    ) {
        this.objectMapper = objectMapper;
        this.enabled = enabled;
        this.limit = limit;
        this.windowMs = windowMs;
        this.trustedProxies = parseTrustedProxies(trustedProxies);
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

        if (!windows.containsKey(key) && windows.size() >= MAX_TRACKED_KEYS) {
            evictStaleWindows(now);
            evictLeastRecentWindow();
        }

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

    private void evictLeastRecentWindow() {
        String oldestKey = null;
        long oldestTimestamp = Long.MAX_VALUE;
        for (Map.Entry<String, Deque<Long>> entry : windows.entrySet()) {
            Long lastRequest;
            synchronized (entry.getValue()) {
                lastRequest = entry.getValue().peekLast();
            }
            if (lastRequest != null && lastRequest < oldestTimestamp) {
                oldestTimestamp = lastRequest;
                oldestKey = entry.getKey();
            }
        }
        if (oldestKey != null) {
            windows.remove(oldestKey);
        }
    }

    private String clientKey(HttpServletRequest request) {
        HttpServletRequest original = unwrap(request);

        String peer = normalizeAddress(original.getRemoteAddr());
        if (peer == null) {
            peer = original.getRemoteAddr();
        }
        if (peer == null || peer.isBlank()) {
            peer = request.getRemoteAddr();
        }
        if (peer == null || peer.isBlank()) {
            peer = "unknown";
        }

        if (!isTrustedProxy(peer)) {
            return peer;
        }

        String forwarded = original.getHeader("X-Forwarded-For");
        String clientAddress = rightmostAddress(forwarded);
        return clientAddress != null ? clientAddress : peer;
    }

    private static HttpServletRequest unwrap(HttpServletRequest request) {
        ServletRequest current = request;
        int depth = 0;
        while (current instanceof HttpServletRequestWrapper wrapper && depth < MAX_UNWRAP_DEPTH) {
            current = wrapper.getRequest();
            depth++;
        }
        return current instanceof HttpServletRequest unwrapped ? unwrapped : request;
    }

    private boolean isTrustedProxy(String address) {
        byte[] bytes = toAddress(address);
        if (bytes == null) {
            return false;
        }
        for (IpRange range : trustedProxies) {
            if (range.matches(bytes)) {
                return true;
            }
        }
        return false;
    }

    private static String rightmostAddress(String headerValue) {
        if (headerValue == null || headerValue.isBlank()) {
            return null;
        }
        String[] hops = headerValue.split(",");
        for (int i = hops.length - 1; i >= 0; i--) {
            String normalized = normalizeAddress(hops[i]);
            if (normalized != null) {
                return normalized;
            }
        }
        return null;
    }

    private static String normalizeAddress(String raw) {
        byte[] address = toAddress(raw);
        if (address == null) {
            return null;
        }
        try {
            return InetAddress.getByAddress(address).getHostAddress();
        } catch (UnknownHostException ex) {
            return null;
        }
    }

    private static byte[] toAddress(String raw) {
        if (raw == null) {
            return null;
        }
        String value = raw.trim();
        if (value.isEmpty()) {
            return null;
        }

        if (value.startsWith("[") && value.indexOf(']') > 1) {
            value = value.substring(1, value.indexOf(']'));
        } else {
            int colon = value.indexOf(':');
            if (colon >= 0 && colon == value.lastIndexOf(':')
                    && value.substring(colon + 1).matches("\\d{1,5}")) {
                value = value.substring(0, colon);
            }
        }

        if (value.indexOf(':') >= 0) {
            return toIpv6(value);
        }
        return toIpv4(value);
    }

    private static byte[] toIpv4(String value) {
        String[] parts = value.split("\\.", -1);
        if (parts.length != 4) {
            return null;
        }
        byte[] address = new byte[4];
        for (int i = 0; i < parts.length; i++) {
            String part = parts[i];
            if (part.isEmpty() || part.length() > 3) {
                return null;
            }
            for (int j = 0; j < part.length(); j++) {
                char c = part.charAt(j);
                if (c < '0' || c > '9') {
                    return null;
                }
            }
            int octet = Integer.parseInt(part);
            if (octet > 255) {
                return null;
            }
            address[i] = (byte) octet;
        }
        return address;
    }

    private static byte[] toIpv6(String value) {
        if (value.isEmpty() || value.indexOf('%') >= 0) {
            return null;
        }
        char first = value.charAt(0);
        boolean startsLikeLiteral = (first >= '0' && first <= '9')
                || (first >= 'a' && first <= 'f')
                || (first >= 'A' && first <= 'F')
                || first == ':';
        if (!startsLikeLiteral) {
            return null;
        }
        for (int i = 0; i < value.length(); i++) {
            char c = value.charAt(i);
            boolean valid = (c >= '0' && c <= '9')
                    || (c >= 'a' && c <= 'f')
                    || (c >= 'A' && c <= 'F')
                    || c == ':'
                    || c == '.';
            if (!valid) {
                return null;
            }
        }
        try {
            byte[] address = InetAddress.getByName(value).getAddress();
            return address.length == 16 ? address : null;
        } catch (UnknownHostException ex) {
            return null;
        }
    }

    private static List<IpRange> parseTrustedProxies(String raw) {
        String configured = (raw == null || raw.isBlank()) ? DEFAULT_TRUSTED_PROXIES : raw;
        List<IpRange> ranges = parseRanges(configured);
        if (ranges.isEmpty()) {
            log.warn("rate-limit.auth.trusted-proxies no contiene ninguna IP válida; se usan los valores por defecto");
            ranges = parseRanges(DEFAULT_TRUSTED_PROXIES);
        }
        return ranges;
    }

    private static List<IpRange> parseRanges(String value) {
        List<IpRange> ranges = new ArrayList<>();
        for (String token : value.split(",")) {
            IpRange range = IpRange.parse(token);
            if (range != null) {
                ranges.add(range);
            } else if (!token.isBlank()) {
                log.warn("Entrada inválida en rate-limit.auth.trusted-proxies: {}", token.trim());
            }
        }
        return ranges;
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

    private record IpRange(byte[] network, int prefixLength) {

        private static IpRange parse(String raw) {
            if (raw == null) {
                return null;
            }
            String value = raw.trim();
            if (value.isEmpty()) {
                return null;
            }
            int slash = value.indexOf('/');
            byte[] network = toAddress(slash >= 0 ? value.substring(0, slash) : value);
            if (network == null) {
                return null;
            }
            int prefix = network.length * 8;
            if (slash >= 0) {
                String prefixPart = value.substring(slash + 1);
                if (!prefixPart.matches("\\d{1,3}")) {
                    return null;
                }
                prefix = Integer.parseInt(prefixPart);
                if (prefix > network.length * 8) {
                    return null;
                }
            }
            return new IpRange(network, prefix);
        }

        private boolean matches(byte[] address) {
            if (address.length != network.length) {
                return false;
            }
            int fullBytes = prefixLength / 8;
            for (int i = 0; i < fullBytes; i++) {
                if (address[i] != network[i]) {
                    return false;
                }
            }
            int remainingBits = prefixLength % 8;
            if (remainingBits == 0) {
                return true;
            }
            int mask = (0xFF << (8 - remainingBits)) & 0xFF;
            return (address[fullBytes] & mask) == (network[fullBytes] & mask);
        }
    }
}
