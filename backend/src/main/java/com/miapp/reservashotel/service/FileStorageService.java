package com.miapp.reservashotel.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLConnection;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;

/**
 * Handles filesystem-based storage for uploaded assets with basic hardening:
 * size/type validation, sanitized names, and directory limits.
 */
@Service
public class FileStorageService {

    private static final Map<String, String> EXTENSION_TO_CONTENT_TYPE = Map.of(
            ".jpg", "image/jpeg",
            ".jpeg", "image/jpeg",
            ".png", "image/png",
            ".webp", "image/webp"
    );
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.copyOf(EXTENSION_TO_CONTENT_TYPE.values());

    private final Path rootDir;
    private final Path productDir;
    private final Path categoryDir;
    private final long maxFileSizeBytes;
    private final int maxFilesPerDirectory;

    public FileStorageService(@Value("${app.uploads.base-dir:uploads}") String baseDir,
                              @Value("${app.uploads.product-dir:products}") String productsSubDir,
                              @Value("${app.uploads.category-dir:categories}") String categoriesSubDir,
                              @Value("${app.uploads.max-file-size-bytes:5242880}") long maxFileSizeBytes,
                              @Value("${app.uploads.max-files-per-directory:500}") int maxFilesPerDirectory) {
        this.rootDir = Paths.get(baseDir).toAbsolutePath().normalize();
        this.productDir = rootDir.resolve(productsSubDir).toAbsolutePath().normalize();
        this.categoryDir = rootDir.resolve(categoriesSubDir).toAbsolutePath().normalize();
        this.maxFileSizeBytes = maxFileSizeBytes > 0 ? maxFileSizeBytes : 5 * 1024 * 1024;
        this.maxFilesPerDirectory = maxFilesPerDirectory;
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
        return store(file, productDir);
    }

    /** Stores category card image and returns the public URL path. */
    public String storeCategoryImage(MultipartFile file) {
        return store(file, categoryDir);
    }

    private String store(MultipartFile file, Path directory) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File must not be empty");
        }
        String extension = validateAndResolveExtension(file);
        ensureCapacity(directory);

        String filename = UUID.randomUUID().toString().replace("-", "") + extension;
        Path destination = directory.resolve(filename).normalize();
        ensureUnderRoot(destination);

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, destination, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to store file", e);
        }

        Path relative = rootDir.relativize(destination);
        String normalized = relative.toString().replace('\\', '/');
        return "/uploads/" + normalized;
    }

    private void ensureCapacity(Path directory) {
        if (maxFilesPerDirectory <= 0) {
            return; // unlimited
        }
        try (Stream<Path> entries = Files.list(directory)) {
            long count = entries.count();
            if (count >= maxFilesPerDirectory) {
                throw new IllegalArgumentException("Maximum number of stored images reached in this directory");
            }
        } catch (IOException e) {
            throw new IllegalStateException("Failed to inspect upload directory", e);
        }
    }

    private void ensureUnderRoot(Path destination) {
        if (!destination.startsWith(rootDir)) {
            throw new IllegalArgumentException("Invalid upload destination");
        }
    }

    private String validateAndResolveExtension(MultipartFile file) {
        long size = file.getSize();
        if (size <= 0) {
            throw new IllegalArgumentException("File must not be empty");
        }
        if (size > maxFileSizeBytes) {
            throw new IllegalArgumentException("Image file size must be " + formatSize(maxFileSizeBytes) + " or less");
        }

        String extension = resolveExtension(file.getOriginalFilename());
        String expectedContentType = EXTENSION_TO_CONTENT_TYPE.get(extension);

        String declaredType = normalizeContentType(file.getContentType());
        if (declaredType != null) {
            if (!ALLOWED_CONTENT_TYPES.contains(declaredType)) {
                throw new IllegalArgumentException("Only JPEG, PNG or WEBP images are allowed");
            }
            if (expectedContentType != null && !expectedContentType.equals(declaredType)) {
                throw new IllegalArgumentException("File extension does not match declared MIME type");
            }
        }

        String detectedType = detectContentType(file);
        if (detectedType != null) {
            if (!ALLOWED_CONTENT_TYPES.contains(detectedType)) {
                throw new IllegalArgumentException("Only JPEG, PNG or WEBP images are allowed");
            }
            if (expectedContentType != null && !expectedContentType.equals(detectedType)) {
                throw new IllegalArgumentException("File content does not match its extension");
            }
        }

        return extension;
    }

    private String resolveExtension(String originalName) {
        if (originalName == null) {
            throw new IllegalArgumentException("File must include a valid extension");
        }
        String filename = Paths.get(originalName).getFileName().toString();
        int dot = filename.lastIndexOf('.');
        if (dot < 0 || dot == filename.length() - 1) {
            throw new IllegalArgumentException("Only JPEG, PNG or WEBP images are allowed");
        }
        String ext = filename.substring(dot).toLowerCase(Locale.ROOT);
        if (!EXTENSION_TO_CONTENT_TYPE.containsKey(ext)) {
            throw new IllegalArgumentException("Only JPEG, PNG or WEBP images are allowed");
        }
        return ext;
    }

    private String detectContentType(MultipartFile file) {
        try (BufferedInputStream input = new BufferedInputStream(file.getInputStream())) {
            return URLConnection.guessContentTypeFromStream(input);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to inspect file content", e);
        }
    }

    private String normalizeContentType(String contentType) {
        if (contentType == null || contentType.isBlank()) {
            return null;
        }
        return contentType.toLowerCase(Locale.ROOT);
    }

    private String formatSize(long bytes) {
        long mb = bytes / (1024 * 1024);
        if (mb > 0) {
            return mb + "MB";
        }
        long kb = bytes / 1024;
        return kb > 0 ? kb + "KB" : bytes + " bytes";
    }
}
