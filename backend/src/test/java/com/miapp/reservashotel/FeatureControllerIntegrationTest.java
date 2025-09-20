package com.miapp.reservashotel;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.miapp.reservashotel.config.TestSecurityConfig;
import com.miapp.reservashotel.dto.FeatureRequestDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestSecurityConfig.class)
@ActiveProfiles("test")
class FeatureControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private FeatureRequestDTO feature;

    @BeforeEach
    void setUp() {
        feature = new FeatureRequestDTO();
        feature.setName("WiFi");
        feature.setDescription("Free WiFi everywhere");
        feature.setIcon("wifi-icon");
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldCreateFeature() throws Exception {
        mockMvc.perform(post("/api/features")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(feature)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value("WiFi"));
    }

    @Test
    void shouldGetAllFeatures() throws Exception {
        mockMvc.perform(get("/api/features"))
            .andExpect(status().isOk());
    }
}






