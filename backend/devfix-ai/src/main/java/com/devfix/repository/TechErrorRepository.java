package com.devfix.repository;

import com.devfix.entity.TechError;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Data access layer for TechError.
 *
 * JpaRepository gives us for free:
 *   findAll(), findById(), save(), deleteById(), existsById(), count()...
 *
 * We add custom queries below for DevFix-specific search needs.
 */
public interface TechErrorRepository extends JpaRepository<TechError, Long> {

    // ── Filter by technology ID ───────────────────────────────────────────────
    // SELECT * FROM tech_errors WHERE technology_id = ?
    List<TechError> findByTechnologyId(Long technologyId);

    // ── Filter by severity ───────────────────────────────────────────────────
    // SELECT * FROM tech_errors WHERE LOWER(severity) = LOWER(?)
    List<TechError> findBySeverityIgnoreCase(String severity);

    // ── Filter by OS ─────────────────────────────────────────────────────────
    List<TechError> findByOsAffectedIgnoreCase(String osAffected);

    // ── CORE SEARCH: The main DevFix AI feature ───────────────────────────────
    // Searches across errorCode, errorMessage, cause, solution, and tags
    // This is what runs when a user types "JAVA_HOME" in the search bar
    @Query("SELECT e FROM TechError e WHERE " +
           "LOWER(e.errorCode)    LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.errorMessage) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.cause)        LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.solution)     LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.tags)         LIKE LOWER(CONCAT('%', :query, '%'))")
    List<TechError> searchErrors(@Param("query") String query);
}
