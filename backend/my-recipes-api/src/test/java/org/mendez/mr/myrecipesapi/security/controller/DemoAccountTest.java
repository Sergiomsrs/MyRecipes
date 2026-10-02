package org.mendez.mr.myrecipesapi.security.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mendez.mr.myrecipesapi.entity.User;
import org.mendez.mr.myrecipesapi.enums.RecipeCategory;
import org.mendez.mr.myrecipesapi.enums.Role;
import org.mendez.mr.myrecipesapi.repository.UserRepository;
import org.mendez.mr.myrecipesapi.security.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Reglas de la cuenta demo (Role.DEMO) sobre la API real: H2 + MockMvc.
 * Los limites se bajan a 2 para no crear 15 recetas en cada test.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@TestPropertySource(properties = {
        "app.demo.max-recipes=2",
        "app.demo.max-versions-per-recipe=2",
        "rate-limit.auth.enabled=false"
})
class DemoAccountTest {

    private static final String PASSWORD = "password123";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String demoToken;
    private String userToken;
    private UUID demoUserId;
    private UUID normalUserId;

    @BeforeEach
    void setUp() {
        demoUserId = register("demo-" + UUID.randomUUID() + "@example.com", Role.DEMO);
        normalUserId = register("user-" + UUID.randomUUID() + "@example.com", Role.USER);
        demoToken = login(demoUserId);
        userToken = login(normalUserId);
    }

    @Test
    void demoRecibe403AlCambiarLaContrasena() throws Exception {
        mockMvc.perform(put("/api/users/me/password")
                        .header("Authorization", "Bearer " + demoToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"currentPassword":"%s","newPassword":"nuevaPassword123"}
                                """.formatted(PASSWORD)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403))
                .andExpect(jsonPath("$.message").value("No disponible en la cuenta demo"));
    }

    @Test
    void laDemoNoCambiaLaContrasena() throws Exception {
        String storedPassword = passwordOf(demoUserId);

        assertThat(passwordEncoder.matches(PASSWORD, storedPassword)).isTrue();
        assertThat(passwordEncoder.matches("nuevaPassword123", storedPassword)).isFalse();
    }

    @Test
    void unUsuarioNormalPuedeCambiarLaContrasena() throws Exception {
        mockMvc.perform(put("/api/users/me/password")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"currentPassword":"%s","newPassword":"nuevaPassword123"}
                                """.formatted(PASSWORD)))
                .andExpect(status().isOk());

        assertThat(passwordEncoder.matches("nuevaPassword123", passwordOf(normalUserId))).isTrue();
    }

    @Test
    void laDemoNoPuedeCrearMasRecetasQueElLimite() throws Exception {
        createRecipe(demoToken, "Primera receta");
        createRecipe(demoToken, "Segunda receta");

        mockMvc.perform(post("/api/v1/recipes")
                        .header("Authorization", "Bearer " + demoToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(recipeBody("Tercera receta")))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403))
                .andExpect(jsonPath("$.message").value(
                        "Límite de la cuenta demo alcanzado: máximo 2 recetas"));

        mockMvc.perform(get("/api/v1/recipes")
                        .header("Authorization", "Bearer " + demoToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void unUsuarioNormalNoTieneLimiteDeRecetas() throws Exception {
        createRecipe(userToken, "Primera receta");
        createRecipe(userToken, "Segunda receta");
        createRecipe(userToken, "Tercera receta");

        mockMvc.perform(get("/api/v1/recipes")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3));
    }

    @Test
    void laDemoNoPuedeSuperarElLimiteDeVersionesDeUnaReceta() throws Exception {
        UUID recipeId = createRecipe(demoToken, "Tortilla de patatas");

        createVersion(demoToken, recipeId, "Segunda versión");
        mockMvc.perform(post("/api/v1/recipes/{id}/versions", recipeId)
                        .header("Authorization", "Bearer " + demoToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(versionBody("Tercera versión")))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403))
                .andExpect(jsonPath("$.message").value(
                        "Límite de la cuenta demo alcanzado: máximo 2 versiones por receta"));
    }

    @Test
    void laDemoPuedeEditarYborrarSusRecetas() throws Exception {
        UUID recipeId = createRecipe(demoToken, "Tortilla de patatas");

        mockMvc.perform(put("/api/v1/recipes/{id}", recipeId)
                        .header("Authorization", "Bearer " + demoToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title":"Tortilla de patatas (editada)","description":"Jugosa","category":"STARTER"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Tortilla de patatas (editada)"));

        mockMvc.perform(delete("/api/v1/recipes/{id}", recipeId)
                        .header("Authorization", "Bearer " + demoToken))
                .andExpect(status().isNoContent());
    }

    @Test
    void elRegistroIgnoraElRolDelBody() throws Exception {
        String email = "nuevo-" + UUID.randomUUID() + "@example.com";

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"%s","password":"password123","role":"DEMO"}
                                """.formatted(email)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("USER"));

        assertThat(userRepository.findByEmailIgnoreCase(email))
                .get()
                .extracting(User::getRole)
                .isEqualTo(Role.USER);
    }

    @Test
    void elCambioDeContrasenaNoModificaElRol() throws Exception {
        mockMvc.perform(put("/api/users/me/password")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"currentPassword":"%s","newPassword":"nuevaPassword123","role":"DEMO"}
                                """.formatted(PASSWORD)))
                .andExpect(status().isOk());

        assertThat(userRepository.findById(normalUserId))
                .get()
                .extracting(User::getRole)
                .isEqualTo(Role.USER);
    }

    @Test
    void elPerfilDevuelveElRolDeCadaCuenta() throws Exception {
        mockMvc.perform(get("/api/users/me")
                        .header("Authorization", "Bearer " + demoToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(userRepository.findById(demoUserId).get().getEmail()))
                .andExpect(jsonPath("$.role").value("DEMO"));

        mockMvc.perform(get("/api/users/me")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("USER"));
    }

    private UUID register(String email, Role role) {
        return userService.registerUser(new User(email, PASSWORD, role)).getId();
    }

    private String login(UUID userId) throws Exception {
        String email = userRepository.findById(userId).get().getEmail();

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"%s","password":"%s"}
                                """.formatted(email, PASSWORD)))
                .andExpect(status().isOk())
                .andReturn();

        return objectMapper.readTree(result.getResponse().getContentAsString()).get("token").asText();
    }

    private UUID createRecipe(String token, String title) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/v1/recipes")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(recipeBody(title)))
                .andExpect(status().isCreated())
                .andReturn();

        return UUID.fromString(objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asText());
    }

    private void createVersion(String token, UUID recipeId, String summary) throws Exception {
        mockMvc.perform(post("/api/v1/recipes/{id}/versions", recipeId)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(versionBody(summary)))
                .andExpect(status().isCreated());
    }

    private String recipeBody(String title) {
        return """
                {
                  "title": "%s",
                  "description": "Receta de prueba",
                  "category": "%s",
                  "summaryChanges": "Versión inicial",
                  "ingredients": [
                    {"name": "Patatas", "quantity": 500, "unit": "g", "orderIndex": 1}
                  ],
                  "steps": [
                    {"order": 1, "description": "Pelar y cortar las patatas."}
                  ]
                }
                """.formatted(title, RecipeCategory.MAIN_COURSE);
    }

    private String versionBody(String summary) {
        return """
                {
                  "summaryChanges": "%s",
                  "ingredients": [
                    {"name": "Patatas", "quantity": 600, "unit": "g", "orderIndex": 1}
                  ],
                  "steps": [
                    {"order": 1, "description": "Pelar y cortar las patatas."}
                  ]
                }
                """.formatted(summary);
    }

    private String passwordOf(UUID userId) {
        return userRepository.findById(userId).get().getPassword();
    }
}