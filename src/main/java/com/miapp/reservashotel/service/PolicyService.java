package com.miapp.reservashotel.service;

import com.miapp.reservashotel.dto.PolicyRequestDTO;
import com.miapp.reservashotel.dto.PolicyResponseDTO;

import java.util.List;

public interface PolicyService {
    PolicyResponseDTO create(PolicyRequestDTO dto);
    PolicyResponseDTO update(Long id, PolicyRequestDTO dto);
    void delete(Long id);
    PolicyResponseDTO getById(Long id);
    List<PolicyResponseDTO> getByProduct(Long productId);
}

