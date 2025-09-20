package com.miapp.reservashotel.controller;

import com.miapp.reservashotel.dto.AdminRoleRequestDTO;
import com.miapp.reservashotel.dto.UserRolesResponseDTO;
import com.miapp.reservashotel.service.AdminUserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin-only endpoints to manage ADMIN role on users.
 * Base path: /api/admin/users
 */
@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    /**
     * Grant ADMIN role to a user identified by email.
     */
    @PostMapping("/grant-admin")
    public ResponseEntity<UserRolesResponseDTO> grantAdmin(@Valid @RequestBody AdminRoleRequestDTO dto) {
        return ResponseEntity.ok(adminUserService.grantAdmin(dto));
    }

    /**
     * Revoke ADMIN role from a user identified by email.
     */
    @PostMapping("/revoke-admin")
    public ResponseEntity<UserRolesResponseDTO> revokeAdmin(@Valid @RequestBody AdminRoleRequestDTO dto) {
        return ResponseEntity.ok(adminUserService.revokeAdmin(dto));
    }

    /**
     * List all users with ADMIN role.
     */
    @GetMapping("/admins")
    public ResponseEntity<List<UserRolesResponseDTO>> listAdmins() {
        return ResponseEntity.ok(adminUserService.listAdmins());
    }
}

