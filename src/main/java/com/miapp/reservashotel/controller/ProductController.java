package com.miapp.reservashotel.controller;

import com.miapp.reservashotel.dto.ProductResponseDTO;
import com.miapp.reservashotel.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService service;
    public ProductController(ProductService service) { this.service = service; }

    @GetMapping
    public Page<ProductResponseDTO> list(Pageable pageable) {
        List<ProductResponseDTO> all = service.getAllProducts();
        int page = pageable.getPageNumber();
        int size = pageable.getPageSize();
        int from = Math.min(page * size, all.size());
        int to = Math.min(from + size, all.size());
        List<ProductResponseDTO> slice = all.subList(from, to);
        return new PageImpl<>(slice, PageRequest.of(page, size), all.size());
    }

    @GetMapping("/{id}")
    public ProductResponseDTO getOne(@PathVariable Long id) {
        return service.getProductById(id);
    }

    @GetMapping("/available")
    public Page<ProductResponseDTO> available(Pageable pageable) {
        return list(pageable);
    }

    @GetMapping("/search")
    public Page<ProductResponseDTO> search(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long cityId,
            @RequestParam(required = false) Long featureId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String q,
            Pageable pageable
    ) {
        List<ProductResponseDTO> filtered = service.searchProducts(
                categoryId, cityId, featureId, minPrice, maxPrice, q
        );
        int page = pageable.getPageNumber();
        int size = pageable.getPageSize();
        int from = Math.min(page * size, filtered.size());
        int to = Math.min(from + size, filtered.size());
        List<ProductResponseDTO> slice = filtered.subList(from, to);
        return new PageImpl<>(slice, PageRequest.of(page, size), filtered.size());
    }
}
