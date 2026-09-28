package org.mendez.mr.myrecipesapi.security.ratelimit;

import com.fasterxml.jackson.databind.json.JsonMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;

class RateLimitFilterTest {

    private static final String TRUSTED_PROXIES =
            "127.0.0.0/8,::1,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,fc00::/7";
    private static final int LIMIT = 3;

    private RateLimitFilter filter;

    @BeforeEach
    void setUp() {
        filter = new RateLimitFilter(JsonMapper.builder().findAndAddModules().build(), true, LIMIT, 60_000L, TRUSTED_PROXIES);;
    }

    @Test
    void devuelve429AlSuperarElLimite() throws Exception {
        for (int i = 0; i < LIMIT; i++) {
            assertThat(call(authRequest("203.0.113.10", null)).getStatus()).isEqualTo(200);
        }

        MockHttpServletResponse rejected = call(authRequest("203.0.113.10", null));

        assertThat(rejected.getStatus()).isEqualTo(429);
        assertThat(rejected.getHeader("Retry-After")).isNotNull();
    }

    @Test
    void ignoraElXffCuandoLaConexionNoLlegaDeUnProxyDeConfianza() throws Exception {
        String[] spoofedHops = {"6.6.6.1", "6.6.6.2", "6.6.6.3", "6.6.6.4"};

        for (int i = 0; i < LIMIT; i++) {
            assertThat(call(authRequest("203.0.113.10", spoofedHops[i])).getStatus()).isEqualTo(200);
        }

        assertThat(call(authRequest("203.0.113.10", spoofedHops[LIMIT])).getStatus()).isEqualTo(429);
    }

    @Test
    void usaLaUltimaIpValidaDelXffDetrasDeUnProxyDeConfianza() throws Exception {
        for (int i = 0; i < LIMIT; i++) {
            assertThat(call(authRequest("172.18.0.5", "198.51.100.7")).getStatus()).isEqualTo(200);
        }

        assertThat(call(authRequest("172.18.0.5", "198.51.100.7")).getStatus()).isEqualTo(429);
        assertThat(call(authRequest("172.18.0.5", "6.6.6.6, 198.51.100.7")).getStatus()).isEqualTo(429);
        assertThat(call(authRequest("172.18.0.5", "198.51.100.9")).getStatus()).isEqualTo(200);
    }

    @Test
    void usaElPeerCuandoElXffNoContieneIpsValidas() throws Exception {
        for (int i = 0; i < LIMIT; i++) {
            assertThat(call(authRequest("172.18.0.5", "unknown")).getStatus()).isEqualTo(200);
        }

        assertThat(call(authRequest("172.18.0.5", "unknown")).getStatus()).isEqualTo(429);
    }

    @Test
    void usaElPeerRealAunqueForwardedHeaderFilterHayaReescritoElRemoteAddr() throws Exception {
        for (int i = 0; i < LIMIT; i++) {
            MockHttpServletRequest request = authRequest("203.0.113.10", "6.6.6." + i);
            assertThat(call(withForwardedHeaderFilter(request, "6.6.6.100")).getStatus()).isEqualTo(200);
        }

        MockHttpServletRequest last = authRequest("203.0.113.10", "6.6.6.99");
        assertThat(call(withForwardedHeaderFilter(last, "6.6.6.101")).getStatus()).isEqualTo(429);
    }

    @Test
    void usaElXffOriginalAunqueForwardedHeaderFilterHayaOcultadoLaCabecera() throws Exception {
        String[] peers = {"172.18.0.5", "172.18.0.6", "172.18.0.7", "172.18.0.8"};

        for (int i = 0; i < LIMIT; i++) {
            MockHttpServletRequest request = authRequest(peers[i], "198.51.100.7");
            assertThat(call(withForwardedHeaderFilter(request, "6.6.6." + i)).getStatus()).isEqualTo(200);
        }

        MockHttpServletRequest last = authRequest(peers[LIMIT], "198.51.100.7");
        assertThat(call(withForwardedHeaderFilter(last, "6.6.6.99")).getStatus()).isEqualTo(429);
    }

    private MockHttpServletRequest authRequest(String remoteAddr, String forwardedFor) {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/auth/login");
        request.setRemoteAddr(remoteAddr);
        if (forwardedFor != null) {
            request.addHeader("X-Forwarded-For", forwardedFor);
        }
        return request;
    }

    private static HttpServletRequest withForwardedHeaderFilter(HttpServletRequest request,
                                                                String rewrittenRemoteAddr) {
        return new HttpServletRequestWrapper(request) {
            @Override
            public String getRemoteAddr() {
                return rewrittenRemoteAddr;
            }

            @Override
            public String getHeader(String name) {
                if ("X-Forwarded-For".equalsIgnoreCase(name)) {
                    return null;
                }
                return super.getHeader(name);
            }
        };
    }

    private MockHttpServletResponse call(HttpServletRequest request) throws ServletException, IOException {
        MockHttpServletResponse response = new MockHttpServletResponse();
        filter.doFilter(request, response, (req, res) -> { });
        return response;
    }
}
