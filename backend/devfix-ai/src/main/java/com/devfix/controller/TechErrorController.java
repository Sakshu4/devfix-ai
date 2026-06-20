package com.devfix.controller;

import com.devfix.entity.TechError;
import com.devfix.service.TechErrorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for TechError (Error Knowledge Base).
 *
 * Public API:
 *   GET  /errors                          → all errors
 *   GET  /errors/{id}                     → one error
 *   GET  /errors/search?q=JAVA_HOME       → SEARCH (core DevFix feature)
 *   GET  /errors/technology/{techId}      → all errors for one technology
 *   GET  /errors/severity/{level}         → filter by HIGH / CRITICAL etc.
 *   POST /errors                          → add a new error
 *   PUT  /errors/{id}                     → update
 *   DELETE /errors/{id}                   → delete
 */
@RestController
@RequestMapping("/errors")
public class TechErrorController {

    @Autowired
    private TechErrorService techErrorService;

    // ── GET all errors ────────────────────────────────────────────────────────
    @GetMapping
    public List<TechError> getAllErrors() {
        return techErrorService.getAllErrors();
    }

    // ── GET by ID ─────────────────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<TechError> getErrorById(@PathVariable Long id) {
        return ResponseEntity.ok(techErrorService.getErrorById(id));
    }

    // ── SEARCH — the main DevFix AI feature ──────────────────────────────────
    // Example: GET /errors/search?q=JAVA_HOME
    // Example: GET /errors/search?q=port+8080
    @GetMapping("/search")
    public List<TechError> searchErrors(@RequestParam String q) {
        return techErrorService.searchErrors(q);
    }

    // ── Filter by technology ID ───────────────────────────────────────────────
    // Example: GET /errors/technology/1  → all Java errors
    @GetMapping("/technology/{techId}")
    public List<TechError> getErrorsByTechnology(@PathVariable Long techId) {
        return techErrorService.getErrorsByTechnology(techId);
    }

    // ── Filter by severity ────────────────────────────────────────────────────
    // Example: GET /errors/severity/CRITICAL
    @GetMapping("/severity/{level}")
    public List<TechError> getErrorsBySeverity(@PathVariable String level) {
        return techErrorService.getErrorsBySeverity(level);
    }

    // ── POST — add new error ──────────────────────────────────────────────────
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TechError createError(@Valid @RequestBody TechError techError) {
        return techErrorService.createError(techError);
    }

    // ── PUT — update ──────────────────────────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<TechError> updateError(
            @PathVariable Long id,
            @RequestBody TechError updatedData) {    // no @Valid — partial updates allowed
        return ResponseEntity.ok(techErrorService.updateError(id, updatedData));
    }

    // ── DELETE ────────────────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteError(@PathVariable Long id) {
        techErrorService.deleteError(id);
        return ResponseEntity.noContent().build();
    }
}
