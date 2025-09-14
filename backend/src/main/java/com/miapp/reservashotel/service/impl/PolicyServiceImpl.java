package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.dto.PolicyRequestDTO;
import com.miapp.reservashotel.dto.PolicyResponseDTO;
import com.miapp.reservashotel.model.Policy;
import com.miapp.reservashotel.model.Product;
import com.miapp.reservashotel.repository.PolicyRepository;
import com.miapp.reservashotel.repository.ProductRepository;
import com.miapp.reservashotel.service.PolicyService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PolicyServiceImpl implements PolicyService {

    private final PolicyRepository policyRepository;
    private final ProductRepository productRepository;

    public PolicyServiceImpl(PolicyRepository policyRepository, ProductRepository productRepository) {
        this.policyRepository = policyRepository;
        this.productRepository = productRepository;
    }

    @Override
    public PolicyResponseDTO create(PolicyRequestDTO dto) {
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        Policy p = new Policy();
        p.setTitle(dto.getTitle());
        p.setDescription(dto.getDescription());
        p.setProduct(product);

        p = policyRepository.save(p);
        return toDto(p);
    }

    @Override
    public PolicyResponseDTO update(Long id, PolicyRequestDTO dto) {
        Policy p = policyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Policy not found"));

        if (dto.getProductId() != null) {
            Product product = productRepository.findById(dto.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));
            p.setProduct(product);
        }
        p.setTitle(dto.getTitle());
        p.setDescription(dto.getDescription());
        return toDto(policyRepository.save(p));
    }

    @Override
    public void delete(Long id) {
        policyRepository.deleteById(id);
    }

    @Override
    public PolicyResponseDTO getById(Long id) {
        return policyRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Policy not found"));
    }

    @Override
    public List<PolicyResponseDTO> getByProduct(Long productId) {
        return policyRepository.findByProductId(productId).stream()
                .map(this::toDto)
                .toList();
    }

    private PolicyResponseDTO toDto(Policy p) {
        Long productId = (p.getProduct() != null ? p.getProduct().getId() : null);
        return new PolicyResponseDTO(p.getId(), productId, p.getTitle(), p.getDescription());
    }
}

