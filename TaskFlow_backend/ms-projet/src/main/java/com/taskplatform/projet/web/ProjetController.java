package com.taskplatform.projet.web;

import com.taskplatform.projet.domain.Priorite;
import com.taskplatform.projet.domain.ProjetStatut;
import com.taskplatform.projet.dto.ProjetDto;
import com.taskplatform.projet.service.ProjetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projets")
@RequiredArgsConstructor
public class ProjetController {

    private final ProjetService projetService;

    @GetMapping
    public List<ProjetDto> findAll(
            @RequestParam(required = false) ProjetStatut statut,
            @RequestParam(required = false) Priorite priorite,
            @RequestParam(required = false) Long chefId) {
        if (statut == null && priorite == null && chefId == null) {
            return projetService.findAll();
        }
        return projetService.search(statut, priorite, chefId);
    }

    @GetMapping("/{id}")
    public ProjetDto findById(@PathVariable Long id) {
        return projetService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjetDto create(@Valid @RequestBody ProjetDto dto) {
        return projetService.create(dto);
    }

    @PutMapping("/{id}")
    public ProjetDto update(@PathVariable Long id, @Valid @RequestBody ProjetDto dto) {
        return projetService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        projetService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
