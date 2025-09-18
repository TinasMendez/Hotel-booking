package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.dto.AdminRoleRequestDTO;
import com.miapp.reservashotel.dto.UserRolesResponseDTO;
import com.miapp.reservashotel.exception.ResourceNotFoundException;
import com.miapp.reservashotel.model.Role;
import com.miapp.reservashotel.model.User;
import com.miapp.reservashotel.repository.RoleRepository;
import com.miapp.reservashotel.repository.UserRepository;
import com.miapp.reservashotel.service.AdminUserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service to grant/revoke ADMIN role from users by email.
 * - Avoid duplicates using Set<Role>.
 * - Throws ResourceNotFoundException if user or role is missing.
 */
@Service
@Transactional
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public AdminUserServiceImpl(UserRepository userRepository,
                                RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public UserRolesResponseDTO grantAdmin(AdminRoleRequestDTO dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + dto.getEmail()));

        Role admin = findAdminRole();

        Set<Role> roles = new HashSet<>(user.getRoles() != null ? user.getRoles() : Set.of());
        roles.add(admin);
        user.setRoles(roles);
        user = userRepository.save(user);

        return toResponse(user);
    }

    @Override
    public UserRolesResponseDTO revokeAdmin(AdminRoleRequestDTO dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + dto.getEmail()));

        Set<Role> roles = new HashSet<>(user.getRoles() != null ? user.getRoles() : Set.of());
        roles = roles.stream()
                .filter(r -> {
                    String name = r.getName();
                    return !"ADMIN".equals(name) && !"ROLE_ADMIN".equals(name);
                })
                .collect(Collectors.toCollection(LinkedHashSet::new));
        user.setRoles(roles);
        user = userRepository.save(user);

        return toResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserRolesResponseDTO> listAdmins() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRoles() != null && u.getRoles().stream()
                        .anyMatch(r -> {
                            String name = r.getName();
                            return "ADMIN".equals(name) || "ROLE_ADMIN".equals(name);
                        }))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // --- Helpers ---

    private UserRolesResponseDTO toResponse(User user) {
        Set<String> roleNames = user.getRoles() == null
                ? new LinkedHashSet<>()
                : user.getRoles().stream()
                    .map(Role::getName)
                    .collect(Collectors.toCollection(LinkedHashSet::new));

        // Build DTO using the all-args constructor
        return new UserRolesResponseDTO(user.getId(), user.getEmail(), roleNames);
    }

    private Role findAdminRole() {
        return roleRepository.findByName("ROLE_ADMIN")
                .or(() -> roleRepository.findByName("ADMIN"))
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: ROLE_ADMIN"));
    }
}
