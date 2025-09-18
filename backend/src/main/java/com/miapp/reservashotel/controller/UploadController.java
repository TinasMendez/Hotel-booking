package com.miapp.reservashotel.controller;

import com.miapp.reservashotel.service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.Map;

/**
 * Handles media uploads exposed to admin users.
 */
@RestController
@RequestMapping("/api/uploads")
public class UploadController {

    private final FileStorageService fileStorageService;

    public UploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    private ResponseEntity<Map<String, String>> buildUploadResponse(String relativeUrl) {
        String absoluteUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path(relativeUrl)
                .toUriString();
        return ResponseEntity.ok(Map.of(
                "url", absoluteUrl,
                "path", relativeUrl
        ));
    }

    @PostMapping("/product-image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> uploadProductImage(@RequestParam("file") MultipartFile file) {
        String relativeUrl = fileStorageService.storeProductImage(file);
        return buildUploadResponse(relativeUrl);
    }

    @PostMapping("/category-image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> uploadCategoryImage(@RequestParam("file") MultipartFile file) {
        String relativeUrl = fileStorageService.storeCategoryImage(file);
        return buildUploadResponse(relativeUrl);
    }
}

