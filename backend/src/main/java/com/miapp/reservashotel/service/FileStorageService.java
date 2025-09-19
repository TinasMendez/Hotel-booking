package com.miapp.reservashotel.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.UUID;

/**
 * Handles simple filesystem-based storage for uploaded assets.
 */
@Service
public class FileStorageService {

    private final Path rootDir;
    private final Path productDir;
    private final Path categoryDir;

    public FileStorageService(@Value("${app.uploads.base-dir:uploads}") String baseDir,
                              @Value("${app.uploads.product-dir:products}") String productsSubDir,
                              @Value("${app.uploads.category-dir:categories}") String categoriesSubDir) {
        this.rootDir = Paths.get(baseDir).toAbsolutePath().normalize();
        this.productDir = rootDir.resolve(productsSubDir).normalize();
        this.categoryDir = rootDir.resolve(categoriesSubDir).normalize();
        init();
    }

    /** Creates directories upfront to avoid runtime errors when writing files. */
    private void init() {
        try {
            Files.createDirectories(productDir);
            Files.createDirectories(categoryDir);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to initialize upload directories", e);
        }
    }

    /** Stores product gallery image and returns the public URL path. */
    public String storeProductImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File must not be empty");
        }
        validateFile(file);

        String extension = resolveExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + extension;
        Path destination = productDir.resolve(filename);

        try {
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to store file", e);
        }

        Path relative = rootDir.relativize(destination);
        String normalized = relative.toString().replace("\\", "/");
        return "/uploads/" + normalized;
    }

    /** Stores category card image and returns the public URL path. */
    public String storeCategoryImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File must not be empty");
        }
        validateFile(file);

        String extension = resolveExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + extension;
        Path destination = categoryDir.resolve(filename);

        try {
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to store file", e);
        }

        Path relative = rootDir.relativize(destination);
        String normalized = relative.toString().replace("\\", "/");
        return "/uploads/" + normalized;
    }

    private String resolveExtension(String originalName) {
        if (originalName == null) {
            return "";
        }
        int dot = originalName.lastIndexOf('.');
        if (dot < 0 || dot == originalName.length() - 1) {
            return "";
        }
        String ext = originalName.substring(dot).toLowerCase(Locale.ROOT);
        // Keep a short allowlist to prevent non-image uploads from sneaking in.
        return switch (ext) {
            case ".jpg", ".jpeg", ".png", ".webp" -> ext;
            default -> "";
        };
    }

    private void validateFile(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType != null && !contentType.isBlank()) {
            String lower = contentType.toLowerCase(Locale.ROOT);
            if (!(lower.equals("image/jpeg") || lower.equals("image/png") || lower.equals("image/webp"))) {
                throw new IllegalArgumentException("Only JPEG, PNG or WEBP images are allowed");
            }
        }
        long maxBytes = 5 * 1024 * 1024; // 5MB
        if (file.getSize() > maxBytes) {
            throw new IllegalArgumentException("Image file size must be 5MB or less");
        }
    }
}
