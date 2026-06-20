package com.devfix.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "technologies")
public class Technology {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    // --- New fields for DevFix AI Installation Intelligence ---

    @Size(max = 50, message = "Category must not exceed 50 characters")
    private String category;

    @Size(max = 20, message = "Version must not exceed 20 characters")
    private String latestVersion;

    @Size(max = 255, message = "Download URL must not exceed 255 characters")
    private String downloadUrl;

    @Size(max = 255, message = "Official website must not exceed 255 characters")
    private String officialWebsite;

    @Column(columnDefinition = "TEXT")
    private String commonErrors;

    @Column(columnDefinition = "TEXT")
    private String installationSteps;

    // ── Relationship: One technology has MANY errors ───────────────────────────
    // mappedBy = "technology"  means TechError.technology owns the FK column
    // FetchType.LAZY           means errors are NOT loaded unless you call getErrors()
    // @JsonIgnoreProperties    prevents circular JSON: Technology → errors → technology → errors...
    @OneToMany(mappedBy = "technology", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnoreProperties("technology")
    private List<TechError> errors = new ArrayList<>();

    // Getters and Setters

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getLatestVersion() {
        return latestVersion;
    }

    public void setLatestVersion(String latestVersion) {
        this.latestVersion = latestVersion;
    }

    public String getDownloadUrl() {
        return downloadUrl;
    }

    public void setDownloadUrl(String downloadUrl) {
        this.downloadUrl = downloadUrl;
    }

    public String getOfficialWebsite() {
        return officialWebsite;
    }

    public void setOfficialWebsite(String officialWebsite) {
        this.officialWebsite = officialWebsite;
    }

    public String getCommonErrors() {
        return commonErrors;
    }

    public void setCommonErrors(String commonErrors) {
        this.commonErrors = commonErrors;
    }

    public String getInstallationSteps() {
        return installationSteps;
    }

    public void setInstallationSteps(String installationSteps) {
        this.installationSteps = installationSteps;
    }

    public List<TechError> getErrors() {
        return errors;
    }

    public void setErrors(List<TechError> errors) {
        this.errors = errors;
    }
}