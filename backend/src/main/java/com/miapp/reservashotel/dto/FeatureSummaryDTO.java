package com.miapp.reservashotel.dto;

/**
 * Lightweight DTO exposing the minimum information required to render a feature
 * alongside a product card/detail: identifier, display name and icon.
 */
public class FeatureSummaryDTO {

    private Long id;
    private String name;
    private String icon;

    public FeatureSummaryDTO() {
    }

    public FeatureSummaryDTO(Long id, String name, String icon) {
        this.id = id;
        this.name = name;
        this.icon = icon;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}

