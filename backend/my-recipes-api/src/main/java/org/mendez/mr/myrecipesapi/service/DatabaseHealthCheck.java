package org.mendez.mr.myrecipesapi.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Comprueba la conexión a la base de datos y cachea el resultado durante
 * health.db-cache-ttl-ms, para que /health y /actuator/health no puedan agotar
 * el pool de conexiones por sí solos (el pool es pequeño y ambas rutas son públicas).
 *
 * El bean se llama dbHealthIndicator a propósito: así anula el indicador de base de
 * datos que registra Spring Boot (DataSourceHealthContributorAutoConfiguration),
 * que abre una conexión en cada petición. Solo un hilo refresca el resultado y el
 * resto sirve el último conocido, de modo que una BD caída, que puede bloquear hasta
 * connection-timeout, no retiene más de un hilo a la vez.
 */
@Component("dbHealthIndicator")
public class DatabaseHealthCheck implements HealthIndicator {

    private static final Logger log = LoggerFactory.getLogger(DatabaseHealthCheck.class);
    private static final int VALIDATION_TIMEOUT_SECONDS = 2;

    private final DataSource dataSource;
    private final long cacheTtlMs;
    private final Object coldStartLock = new Object();
    private final AtomicBoolean refreshing = new AtomicBoolean();
    private volatile Snapshot snapshot;

    public DatabaseHealthCheck(
            DataSource dataSource,
            @Value("${health.db-cache-ttl-ms:5000}") long cacheTtlMs
    ) {
        this.dataSource = dataSource;
        this.cacheTtlMs = cacheTtlMs;
    }

    @Override
    public Health health() {
        return currentHealth();
    }

    public Health currentHealth() {
        Snapshot current = this.snapshot;
        if (isFresh(current, System.currentTimeMillis())) {
            return current.health();
        }
        if (current == null) {
            return coldStart();
        }
        if (refreshing.compareAndSet(false, true)) {
            try {
                return refresh();
            } finally {
                refreshing.set(false);
            }
        }
        return current.health();
    }

    private Health coldStart() {
        synchronized (coldStartLock) {
            Snapshot current = this.snapshot;
            if (isFresh(current, System.currentTimeMillis())) {
                return current.health();
            }
            return refresh();
        }
    }

    private Health refresh() {
        Health result = checkDatabase();
        this.snapshot = new Snapshot(result, System.currentTimeMillis());
        return result;
    }

    private boolean isFresh(Snapshot current, long now) {
        return current != null && now - current.checkedAt() < cacheTtlMs;
    }

    private Health checkDatabase() {
        try (Connection connection = dataSource.getConnection()) {
            if (connection.isValid(VALIDATION_TIMEOUT_SECONDS)) {
                return Health.up().build();
            }
        } catch (Exception ex) {
            log.warn("Health check fallido: {}", ex.getMessage());
        }
        return Health.down().build();
    }

    private record Snapshot(Health health, long checkedAt) {
    }
}
