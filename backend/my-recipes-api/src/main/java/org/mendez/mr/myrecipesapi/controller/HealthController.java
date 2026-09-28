package org.mendez.mr.myrecipesapi.controller;

import org.mendez.mr.myrecipesapi.service.DatabaseHealthCheck;
import org.springframework.boot.actuate.health.Status;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    private final DatabaseHealthCheck databaseHealthCheck;

    public HealthController(DatabaseHealthCheck databaseHealthCheck) {
        this.databaseHealthCheck = databaseHealthCheck;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        if (Status.UP.equals(databaseHealthCheck.currentHealth().getStatus())) {
            return ResponseEntity.ok(Map.of("status", "UP"));
        }
        return ResponseEntity.status(503).body(Map.of("status", "DOWN"));
    }
}
