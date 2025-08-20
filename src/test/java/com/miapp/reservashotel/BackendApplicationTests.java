package com.miapp.reservashotel;

import com.miapp.reservashotel.config.TestSecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@SpringBootTest
@Import(TestSecurityConfig.class) // <- garantiza beans de seguridad mínimos
class BackendApplicationTests {

    @Test
    void contextLoads() {
    }
}



