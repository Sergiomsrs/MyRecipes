package org.mendez.mr.myrecipesapi.service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.actuate.health.Status;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class DatabaseHealthCheckTest {

    private static final long TTL_MS = 100L;

    @Test
    void soloAbreUnaConexionPorIntervalo() throws Exception {
        DataSource dataSource = mock(DataSource.class);
        Connection connection = mock(Connection.class);
        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.isValid(anyInt())).thenReturn(true);

        DatabaseHealthCheck healthCheck = new DatabaseHealthCheck(dataSource, TTL_MS);

        for (int i = 0; i < 5; i++) {
            assertThat(healthCheck.currentHealth().getStatus()).isEqualTo(Status.UP);
        }

        verify(dataSource, times(1)).getConnection();
        verify(connection, times(1)).close();
    }

    @Test
    void vuelveAComprobarLaBaseDeDatosAlCaducarElIntervalo() throws Exception {
        DataSource dataSource = mock(DataSource.class);
        Connection connection = mock(Connection.class);
        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.isValid(anyInt())).thenReturn(true);

        DatabaseHealthCheck healthCheck = new DatabaseHealthCheck(dataSource, TTL_MS);

        assertThat(healthCheck.currentHealth().getStatus()).isEqualTo(Status.UP);
        Thread.sleep(TTL_MS * 2);
        assertThat(healthCheck.currentHealth().getStatus()).isEqualTo(Status.UP);

        verify(dataSource, times(2)).getConnection();
    }

    @Test
    void informaDownSiLaConexionNoEsValida() throws Exception {
        DataSource dataSource = mock(DataSource.class);
        Connection connection = mock(Connection.class);
        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.isValid(anyInt())).thenReturn(false);

        DatabaseHealthCheck healthCheck = new DatabaseHealthCheck(dataSource, TTL_MS);

        assertThat(healthCheck.currentHealth().getStatus()).isEqualTo(Status.DOWN);
    }

    @Test
    void informaDownSiLaBaseDeDatosFalla() throws Exception {
        DataSource dataSource = mock(DataSource.class);
        when(dataSource.getConnection()).thenThrow(new SQLException("Connection refused"));

        DatabaseHealthCheck healthCheck = new DatabaseHealthCheck(dataSource, TTL_MS);

        assertThat(healthCheck.currentHealth().getStatus()).isEqualTo(Status.DOWN);
    }

    @Test
    void cacheaElResultadoDownSinVolverATirar() throws Exception {
        DataSource dataSource = mock(DataSource.class);
        when(dataSource.getConnection()).thenThrow(new SQLException("Connection refused"));

        DatabaseHealthCheck healthCheck = new DatabaseHealthCheck(dataSource, TTL_MS);

        assertThat(healthCheck.currentHealth().getStatus()).isEqualTo(Status.DOWN);
        assertThat(healthCheck.currentHealth().getStatus()).isEqualTo(Status.DOWN);

        verify(dataSource, times(1)).getConnection();
    }
}
