package org.mendez.mr.myrecipesapi.security.dto;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AuthRequestValidationTest {

    private static ValidatorFactory validatorFactory;
    private static Validator validator;

    @BeforeAll
    static void setUpValidator() {
        validatorFactory = Validation.buildDefaultValidatorFactory();
        validator = validatorFactory.getValidator();
    }

    @AfterAll
    static void closeValidator() {
        validatorFactory.close();
    }

    @Test
    void elRegistroExigePasswordDe8A72Caracteres() {
        assertThat(validator.validate(new RegisterRequest("test@email.com", "1234567"))).isNotEmpty();
        assertThat(validator.validate(new RegisterRequest("test@email.com", "12345678"))).isEmpty();
        assertThat(validator.validate(new RegisterRequest("test@email.com", "a".repeat(72)))).isEmpty();
        assertThat(validator.validate(new RegisterRequest("test@email.com", "a".repeat(73)))).isNotEmpty();
    }

    @Test
    void elLoginAceptaPasswordsCortasParaNoBloquearCuentasExistentes() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@email.com");
        request.setPassword("123456");

        assertThat(validator.validate(request)).isEmpty();
    }

    @Test
    void elLoginRechazaPasswordsDemasiadoLargas() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@email.com");
        request.setPassword("a".repeat(73));

        assertThat(validator.validate(request)).isNotEmpty();
    }

    @Test
    void elLoginExigeEmailYPasswordNoVacios() {
        assertThat(validator.validate(new LoginRequest())).hasSize(2);
    }

    @Test
    void elCambioDePasswordExige8A72CaracteresEnLaNueva() {
        assertThat(validator.validate(new ChangePasswordRequest("actual", "1234567"))).isNotEmpty();
        assertThat(validator.validate(new ChangePasswordRequest("actual", "12345678"))).isEmpty();
        assertThat(validator.validate(new ChangePasswordRequest("actual", "a".repeat(73)))).isNotEmpty();
    }

    @Test
    void elCambioDePasswordAceptaUnaActualCorta() {
        assertThat(validator.validate(new ChangePasswordRequest("123456", "12345678"))).isEmpty();
        assertThat(validator.validate(new ChangePasswordRequest("a".repeat(73), "12345678"))).isNotEmpty();
    }

    @Test
    void elEmailNoPuedeSuperarElTamanoDeLaColumna() {
        String longEmail = "a".repeat(250) + "@email.com";

        assertThat(validator.validate(new RegisterRequest(longEmail, "12345678"))).isNotEmpty();

        LoginRequest request = new LoginRequest();
        request.setEmail(longEmail);
        request.setPassword("12345678");
        assertThat(validator.validate(request)).isNotEmpty();
    }
}
