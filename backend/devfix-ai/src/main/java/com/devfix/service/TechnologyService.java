package com.devfix.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.devfix.entity.Technology;
import com.devfix.exception.ResourceNotFoundException;
import com.devfix.repository.TechnologyRepository;

@Service
public class TechnologyService {

    @Autowired
    private TechnologyRepository technologyRepository;

    // GET all
    public List<Technology> getAllTechnologies() {
        return technologyRepository.findAll();
    }

    // GET by ID — throws ResourceNotFoundException if not found
    public Technology getTechnologyById(Long id) {
        return technologyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Technology with id " + id + " not found"));
    }

    // POST - create
    public Technology saveTechnology(Technology technology) {
        return technologyRepository.save(technology);
    }

    // PUT - update
    public Technology updateTechnology(Long id, Technology updatedData) {
        Technology existing = technologyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Technology with id " + id + " not found"));

        // Only update fields that are provided (not null)
        if (updatedData.getName() != null)              existing.setName(updatedData.getName());
        if (updatedData.getDescription() != null)       existing.setDescription(updatedData.getDescription());
        if (updatedData.getCategory() != null)          existing.setCategory(updatedData.getCategory());
        if (updatedData.getLatestVersion() != null)     existing.setLatestVersion(updatedData.getLatestVersion());
        if (updatedData.getDownloadUrl() != null)       existing.setDownloadUrl(updatedData.getDownloadUrl());
        if (updatedData.getOfficialWebsite() != null)   existing.setOfficialWebsite(updatedData.getOfficialWebsite());
        if (updatedData.getCommonErrors() != null)      existing.setCommonErrors(updatedData.getCommonErrors());
        if (updatedData.getInstallationSteps() != null) existing.setInstallationSteps(updatedData.getInstallationSteps());

        return technologyRepository.save(existing);
    }

    // DELETE
    public void deleteTechnology(Long id) {
        if (!technologyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Technology with id " + id + " not found");
        }
        technologyRepository.deleteById(id);
    }
}