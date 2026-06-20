package com.devfix.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.devfix.entity.Technology;

public interface TechnologyRepository extends JpaRepository<Technology, Long> {

}