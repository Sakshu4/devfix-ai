package com.devfix.service;

import com.devfix.entity.TechError;
import com.devfix.entity.Technology;
import com.devfix.exception.ResourceNotFoundException;
import com.devfix.repository.TechErrorRepository;
import com.devfix.repository.TechnologyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TechErrorService {

    @Autowired
    private TechErrorRepository techErrorRepository;

    @Autowired
    private TechnologyRepository technologyRepository;  // needed to validate technology exists

    // ── GET all errors ────────────────────────────────────────────────────────
    public List<TechError> getAllErrors() {
        return techErrorRepository.findAll();
    }

    // ── GET one error by ID ───────────────────────────────────────────────────
    public TechError getErrorById(Long id) {
        return techErrorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TechError with id " + id + " not found"));
    }

    // ── GET errors by technology ──────────────────────────────────────────────
    public List<TechError> getErrorsByTechnology(Long technologyId) {
        // Validate technology exists first
        if (!technologyRepository.existsById(technologyId)) {
            throw new ResourceNotFoundException("Technology with id " + technologyId + " not found");
        }
        return techErrorRepository.findByTechnologyId(technologyId);
    }

    // ── GET errors by severity ────────────────────────────────────────────────
    public List<TechError> getErrorsBySeverity(String severity) {
        return techErrorRepository.findBySeverityIgnoreCase(severity);
    }

    // ── SEARCH (core feature) ─────────────────────────────────────────────────
    public List<TechError> searchErrors(String query) {
        if (query == null || query.trim().isEmpty()) {
            return techErrorRepository.findAll();  // return all if no query
        }
        return techErrorRepository.searchErrors(query.trim());
    }

    // ── CREATE new error ──────────────────────────────────────────────────────
    public TechError createError(TechError techError) {
        // Validate that the technology referenced actually exists
        Long techId = techError.getTechnology().getId();
        Technology technology = technologyRepository.findById(techId)
                .orElseThrow(() -> new ResourceNotFoundException("Technology with id " + techId + " not found"));
        techError.setTechnology(technology);  // attach the full object
        return techErrorRepository.save(techError);
    }

    // ── UPDATE error ──────────────────────────────────────────────────────────
    public TechError updateError(Long id, TechError updatedData) {
        TechError existing = getErrorById(id);  // throws 404 if not found

        if (updatedData.getErrorCode()    != null) existing.setErrorCode(updatedData.getErrorCode());
        if (updatedData.getErrorMessage() != null) existing.setErrorMessage(updatedData.getErrorMessage());
        if (updatedData.getCategory()     != null) existing.setCategory(updatedData.getCategory());
        if (updatedData.getSeverity()     != null) existing.setSeverity(updatedData.getSeverity());
        if (updatedData.getOsAffected()   != null) existing.setOsAffected(updatedData.getOsAffected());
        if (updatedData.getCause()        != null) existing.setCause(updatedData.getCause());
        if (updatedData.getSolution()     != null) existing.setSolution(updatedData.getSolution());
        if (updatedData.getTags()         != null) existing.setTags(updatedData.getTags());

        // Update technology reference if provided
        if (updatedData.getTechnology() != null && updatedData.getTechnology().getId() != null) {
            Long techId = updatedData.getTechnology().getId();
            Technology technology = technologyRepository.findById(techId)
                    .orElseThrow(() -> new ResourceNotFoundException("Technology with id " + techId + " not found"));
            existing.setTechnology(technology);
        }

        return techErrorRepository.save(existing);
    }

    // ── DELETE error ──────────────────────────────────────────────────────────
    public void deleteError(Long id) {
        if (!techErrorRepository.existsById(id)) {
            throw new ResourceNotFoundException("TechError with id " + id + " not found");
        }
        techErrorRepository.deleteById(id);
    }
}
