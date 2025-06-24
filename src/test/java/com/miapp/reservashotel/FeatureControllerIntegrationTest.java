package com.miapp.reservashotel;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.miapp.reservashotel.dto.FeatureRequestDTO;
import com.miapp.reservashotel.model.Feature;
import com.miapp.reservashotel.repository.FeatureRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class FeatureControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private FeatureRepository featureRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        featureRepository.deleteAll(); // Limpiar datos antes de cada test
    }

    @Test
    void shouldCreateFeature() throws Exception {
        FeatureRequestDTO dto = new FeatureRequestDTO();
        dto.setName("WiFi");
        dto.setDescription("High-speed WiFi");

        mockMvc.perform(post("/api/features")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("WiFi"))
                .andExpect(jsonPath("$.description").value("High-speed WiFi"));
    }

    @Test
    void shouldGetAllFeatures() throws Exception {
        Feature feature = new Feature();
        feature.setName("Pool");
        feature.setDescription("Outdoor pool");
        featureRepository.save(feature);

        mockMvc.perform(get("/api/features"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("Pool"));
    }

    @Test
    void shouldGetFeatureById() throws Exception {
        Feature feature = new Feature();
        feature.setName("Gym");
        feature.setDescription("24/7 gym access");
        feature = featureRepository.save(feature);

        mockMvc.perform(get("/api/features/" + feature.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Gym"))
                .andExpect(jsonPath("$.description").value("24/7 gym access"));
    }

    @Test
    void shouldUpdateFeature() throws Exception {
        Feature feature = new Feature();
        feature.setName("Parking");
        feature.setDescription("Free parking");
        feature = featureRepository.save(feature);

        FeatureRequestDTO updateDTO = new FeatureRequestDTO();
        updateDTO.setName("Valet Parking");
        updateDTO.setDescription("24/7 valet service");

        mockMvc.perform(put("/api/features/" + feature.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Valet Parking"))
                .andExpect(jsonPath("$.description").value("24/7 valet service"));
    }

    @Test
    void shouldDeleteFeature() throws Exception {
        Feature feature = new Feature();
        feature.setName("Bar");
        feature.setDescription("Cocktail bar");
        feature = featureRepository.save(feature);

        mockMvc.perform(delete("/api/features/" + feature.getId()))
                .andExpect(status().isNoContent());

        assertThat(featureRepository.findById(feature.getId())).isEmpty();
    }
}

