package com.miapp.reservashotel;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.miapp.reservashotel.dto.AdminRoleRequestDTO;
import com.miapp.reservashotel.dto.CategoryRequestDTO;
import com.miapp.reservashotel.dto.CategoryResponseDTO;
import com.miapp.reservashotel.dto.UserRolesResponseDTO;
import com.miapp.reservashotel.service.AdminUserService;
import com.miapp.reservashotel.service.CategoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AdminSecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CategoryService categoryService;

    @MockBean
    private AdminUserService adminUserService;

    private CategoryRequestDTO categoryRequest;

    private AdminRoleRequestDTO adminRoleRequest;

    @BeforeEach
    void setUp() {
        categoryRequest = new CategoryRequestDTO("Hotels", "Best hotels", "https://example.com/image.jpg");
        adminRoleRequest = new AdminRoleRequestDTO("target@example.com");

        when(categoryService.createCategory(any())).thenReturn(new CategoryResponseDTO(1L, "Hotels", "Best hotels", "https://example.com/image.jpg"));
        when(adminUserService.grantAdmin(any())).thenReturn(new UserRolesResponseDTO(2L, "target@example.com", Set.of("ROLE_ADMIN")));
    }

    @Test
    @WithMockUser(roles = "USER")
    void shouldReturnForbiddenForCategoryCreationWithoutAdminRole() throws Exception {
        mockMvc.perform(post("/api/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(categoryRequest)))
            .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldAllowCategoryCreationForAdminRole() throws Exception {
        mockMvc.perform(post("/api/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(categoryRequest)))
            .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "USER")
    void shouldReturnForbiddenForAdminPanelToolsWithoutAdminRole() throws Exception {
        mockMvc.perform(post("/api/admin/users/grant-admin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(adminRoleRequest)))
            .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldAllowAdminPanelToolsForAdminRole() throws Exception {
        mockMvc.perform(post("/api/admin/users/grant-admin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(adminRoleRequest)))
            .andExpect(status().isOk());
    }
}
