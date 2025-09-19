package com.miapp.reservashotel.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Maps custom properties under the "app" prefix so the application and IDE
 * know them. This removes VS Code "unknown property" warnings and gives
 * type-safe access to these settings.
 *
 * NOTE: No Lombok used. All getters and setters are written by hand.
 */
@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    // ========== Top-level "app.*" ==========
    private String frontendBaseUrl;
    private String supportPhone;
    private String whatsappSupportUrl;

    private Mail mail = new Mail();
    private Uploads uploads = new Uploads();
    private Db db = new Db();
    private Security security = new Security();

    // ----- Getters & Setters -----
    public String getFrontendBaseUrl() { return frontendBaseUrl; }
    public void setFrontendBaseUrl(String frontendBaseUrl) { this.frontendBaseUrl = frontendBaseUrl; }

    public String getSupportPhone() { return supportPhone; }
    public void setSupportPhone(String supportPhone) { this.supportPhone = supportPhone; }

    public String getWhatsappSupportUrl() { return whatsappSupportUrl; }
    public void setWhatsappSupportUrl(String whatsappSupportUrl) { this.whatsappSupportUrl = whatsappSupportUrl; }

    public Mail getMail() { return mail; }
    public void setMail(Mail mail) { this.mail = mail; }

    public Uploads getUploads() { return uploads; }
    public void setUploads(Uploads uploads) { this.uploads = uploads; }

    public Db getDb() { return db; }
    public void setDb(Db db) { this.db = db; }

    public Security getSecurity() { return security; }
    public void setSecurity(Security security) { this.security = security; }

    // ========== app.mail.* ==========
    public static class Mail {
        private String from;
        private String supportContact;

        public String getFrom() { return from; }
        public void setFrom(String from) { this.from = from; }

        public String getSupportContact() { return supportContact; }
        public void setSupportContact(String supportContact) { this.supportContact = supportContact; }
    }

    // ========== app.uploads.* ==========
    public static class Uploads {
        private String baseDir;
        private String productDir;
        private String categoryDir;
        private Integer maxFilesPerDirectory;
        private Long maxFileSizeBytes;

        public String getBaseDir() { return baseDir; }
        public void setBaseDir(String baseDir) { this.baseDir = baseDir; }

        public String getProductDir() { return productDir; }
        public void setProductDir(String productDir) { this.productDir = productDir; }

        public String getCategoryDir() { return categoryDir; }
        public void setCategoryDir(String categoryDir) { this.categoryDir = categoryDir; }

        public Integer getMaxFilesPerDirectory() { return maxFilesPerDirectory; }
        public void setMaxFilesPerDirectory(Integer maxFilesPerDirectory) { this.maxFilesPerDirectory = maxFilesPerDirectory; }

        public Long getMaxFileSizeBytes() { return maxFileSizeBytes; }
        public void setMaxFileSizeBytes(Long maxFileSizeBytes) { this.maxFileSizeBytes = maxFileSizeBytes; }
    }

    // ========== app.db.* ==========
    public static class Db {
        private Boolean ensureProductRatingColumns;

        public Boolean getEnsureProductRatingColumns() { return ensureProductRatingColumns; }
        public void setEnsureProductRatingColumns(Boolean ensureProductRatingColumns) {
            this.ensureProductRatingColumns = ensureProductRatingColumns;
        }
    }

    // ========== app.security.* ==========
    public static class Security {
        private Actuator actuator = new Actuator();

        public Actuator getActuator() { return actuator; }
        public void setActuator(Actuator actuator) { this.actuator = actuator; }

        public static class Actuator {
            private Boolean infoPublic;

            public Boolean getInfoPublic() { return infoPublic; }
            public void setInfoPublic(Boolean infoPublic) { this.infoPublic = infoPublic; }
        }
    }
}
