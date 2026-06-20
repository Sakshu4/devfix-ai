package com.devfix.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * TechError — the CORE entity of DevFix AI.
 *
 * Each record = one real developer error with its cause and solution.
 *
 * Relationship:
 *   Many TechErrors belong to ONE Technology
 *   (e.g. Java has: JAVA_HOME not set, OutOfMemoryError, ClassNotFoundException...)
 *
 * Table: tech_errors
 */
@Entity
@Table(name = "tech_errors")
public class TechError {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ── Relationship: Many errors → One technology ────────────────────────────
    // @JsonIgnoreProperties("errors") prevents circular JSON from the TechError side:
    //   TechError → technology → errors → technology → ... (infinite)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "technology_id", nullable = false)
    @NotNull(message = "Technology is required")
    @JsonIgnoreProperties("errors")
    private Technology technology;

    // ── Error Identity ────────────────────────────────────────────────────────
    @NotBlank(message = "Error code is required")
    @Size(max = 100, message = "Error code must not exceed 100 characters")
    @Column(name = "error_code", nullable = false)
    private String errorCode;      // e.g. "JAVA_HOME_NOT_SET"

    @NotBlank(message = "Error message is required")
    @Column(name = "error_message", columnDefinition = "TEXT", nullable = false)
    private String errorMessage;   // Full error text as seen in terminal

    // ── Classification ────────────────────────────────────────────────────────
    @Size(max = 50)
    private String category;       // Environment, Network, Config, Dependency, Runtime

    @Size(max = 20)
    private String severity;       // LOW, MEDIUM, HIGH, CRITICAL

    @Size(max = 20)
    @Column(name = "os_affected")
    private String osAffected;     // Windows, Linux, MacOS, All

    // ── Knowledge ─────────────────────────────────────────────────────────────
    @NotBlank(message = "Cause is required")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String cause;          // Why does this happen?

    @NotBlank(message = "Solution is required")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String solution;       // Step-by-step fix

    @Size(max = 255)
    private String tags;           // "java,env,windows,path" — for search

    // ── Getters and Setters ───────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Technology getTechnology() { return technology; }
    public void setTechnology(Technology technology) { this.technology = technology; }

    public String getErrorCode() { return errorCode; }
    public void setErrorCode(String errorCode) { this.errorCode = errorCode; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getOsAffected() { return osAffected; }
    public void setOsAffected(String osAffected) { this.osAffected = osAffected; }

    public String getCause() { return cause; }
    public void setCause(String cause) { this.cause = cause; }

    public String getSolution() { return solution; }
    public void setSolution(String solution) { this.solution = solution; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
}
