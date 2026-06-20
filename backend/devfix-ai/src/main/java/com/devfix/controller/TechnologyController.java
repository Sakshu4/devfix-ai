package com.devfix.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.devfix.entity.Technology;
import com.devfix.service.TechnologyService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/technologies")
public class TechnologyController {

    @Autowired
    private TechnologyService technologyService;

    // GET all → http://localhost:8082/technologies
    @GetMapping
    public List<Technology> getAllTechnologies() {
        return technologyService.getAllTechnologies();
    }

    // GET by ID → http://localhost:8082/technologies/1
    @GetMapping("/{id}")
    public ResponseEntity<Technology> getTechnologyById(@PathVariable Long id) {
        Technology technology = technologyService.getTechnologyById(id);
        return ResponseEntity.ok(technology);
        // If not found → ResourceNotFoundException is thrown → GlobalExceptionHandler returns 404 JSON
    }

    // POST → http://localhost:8082/technologies
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)   // 201 Created
    public Technology addTechnology(@Valid @RequestBody Technology technology) {
        return technologyService.saveTechnology(technology);
        // If @NotBlank/@Size fails → MethodArgumentNotValidException → GlobalExceptionHandler → 400 JSON
    }

    // PUT → http://localhost:8082/technologies/1
    @PutMapping("/{id}")
    public ResponseEntity<Technology> updateTechnology(
            @PathVariable Long id,
            @Valid @RequestBody Technology updatedData) {
        Technology updated = technologyService.updateTechnology(id, updatedData);
        return ResponseEntity.ok(updated);
        // If @NotBlank/@Size fails → MethodArgumentNotValidException → GlobalExceptionHandler → 400 JSON
    }

    // DELETE → http://localhost:8082/technologies/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTechnology(@PathVariable Long id) {
        technologyService.deleteTechnology(id);
        return ResponseEntity.noContent().build();   // 204 No Content
        // If not found → ResourceNotFoundException → GlobalExceptionHandler returns 404 JSON
    }
}
