package com.taskplatform.projet.web;

import com.taskplatform.projet.dto.PhaseDto;
import com.taskplatform.projet.service.PhaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PhaseController {

    private final PhaseService phaseService;

    @GetMapping("/api/projets/{projetId}/phases")
    public List<PhaseDto> findByProjet(@PathVariable Long projetId) {
        return phaseService.findByProjet(projetId);
    }

    @PostMapping("/api/projets/{projetId}/phases")
    @ResponseStatus(HttpStatus.CREATED)
    public PhaseDto create(@PathVariable Long projetId, @Valid @RequestBody PhaseDto dto) {
        return phaseService.create(projetId, dto);
    }

    @PutMapping("/api/phases/{phaseId}")
    public PhaseDto update(@PathVariable Long phaseId, @Valid @RequestBody PhaseDto dto) {
        return phaseService.update(phaseId, dto);
    }

    @DeleteMapping("/api/phases/{phaseId}")
    public ResponseEntity<Void> delete(@PathVariable Long phaseId) {
        phaseService.delete(phaseId);
        return ResponseEntity.noContent().build();
    }
}
