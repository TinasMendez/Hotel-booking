package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.dto.PolicyRequestDTO;
import com.miapp.reservashotel.dto.PolicyResponseDTO;
import com.miapp.reservashotel.exception.ResourceNotFoundException;
import com.miapp.reservashotel.model.Policy;
import com.miapp.reservashotel.repository.PolicyRepository;
import com.miapp.reservashotel.repository.ProductRepository;
import com.miapp.reservashotel.service.PolicyService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PolicyServiceImpl implements PolicyService {

    private final PolicyRepository policyRepository;
    private final ProductRepository productRepository;

    public PolicyServiceImpl(PolicyRepository policyRepository, ProductRepository productRepository) {
        this.policyRepository = policyRepository;
        this.productRepository = productRepository;
    }

    @Override
    public PolicyResponseDTO create(PolicyRequestDTO dto) {
        productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + dto.getProductId()));
        Policy p = new Policy(dto.getProductId(), dto.getTitle(), dto.getDescription());
        p = policyRepository.save(p);
        return toDTO(p);
    }

    @Override
    public PolicyResponseDTO update(Long id, PolicyRequestDTO dto) {
        Policy p = policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found: " + id));
        if (!p.getProductId().equals(dto.getProductId())) {
            productRepository.findById(dto.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + dto.getProductId()));
            p.setProductId(dto.getProductId());
        }
        p.setTitle(dto.getTitle());
        p.setDescription(dto.getDescription());
        p = policyRepository.save(p);
        return toDTO(p);
    }

    @Override
    public void delete(Long id) {
        if (!policyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Policy not found: " + id);
        }
        policyRepository.deleteById(id);
    }

    @Override
    public PolicyResponseDTO getById(Long id) {
        return policyRepository.findById(id).map(this::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found: " + id));
    }

    @Override
    public List<PolicyResponseDTO> getByProduct(Long productId) {
        return policyRepository.findByProductId(productId).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    private PolicyResponseDTO toDTO(Policy p) {
        return new PolicyResponseDTO(p.getId(), p.getProductId(), p.getTitle(), p.getDescription());
    }
}

