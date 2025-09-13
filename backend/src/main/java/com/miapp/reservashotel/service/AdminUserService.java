package com.miapp.reservashotel.service;

import com.miapp.reservashotel.dto.AdminRoleRequestDTO;
import com.miapp.reservashotel.dto.UserRolesResponseDTO;

import java.util.List;

public interface AdminUserService {
    UserRolesResponseDTO grantAdmin(AdminRoleRequestDTO dto);
    UserRolesResponseDTO revokeAdmin(AdminRoleRequestDTO dto);
    List<UserRolesResponseDTO> listAdmins();
}

