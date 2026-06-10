package com.taskplatform.projet.service;

import com.taskplatform.projet.domain.Priorite;
import com.taskplatform.projet.domain.Projet;
import com.taskplatform.projet.domain.ProjetStatut;
import com.taskplatform.projet.dto.ProjetDto;
import com.taskplatform.projet.exception.ResourceNotFoundException;
import com.taskplatform.projet.mapper.ProjetMapper;
import com.taskplatform.projet.messaging.ProjetEventPublisher;
import com.taskplatform.projet.messaging.events.ProjetEvent;
import com.taskplatform.projet.repository.ProjetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjetService {

    private final ProjetRepository projetRepository;
    private final ProjetMapper mapper;
    private final ProjetEventPublisher eventPublisher;

    @Transactional(readOnly = true)
    public List<ProjetDto> findAll() {
        return projetRepository.findAll().stream().map(mapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public ProjetDto findById(Long id) {
        return projetRepository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Projet not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<ProjetDto> search(ProjetStatut statut, Priorite priorite, Long chefId) {
        return projetRepository.findAll().stream()
                .filter(p -> statut == null || p.getStatut() == statut)
                .filter(p -> priorite == null || p.getPriorite() == priorite)
                .filter(p -> chefId == null || chefId.equals(p.getChefProjetId()))
                .map(mapper::toDto)
                .toList();
    }

    @Transactional
    public ProjetDto create(ProjetDto dto) {
        Projet entity = mapper.toEntity(dto);
        if (entity.getStatut() == null) entity.setStatut(ProjetStatut.PLANIFIE);
        if (entity.getPriorite() == null) entity.setPriorite(Priorite.MOYENNE);
        Projet saved = projetRepository.save(entity);
        log.info("Projet created id={}", saved.getId());

        eventPublisher.publishProjetCreated(ProjetEvent.builder()
                .projetId(saved.getId())
                .nom(saved.getNom())
                .type("CREATED")
                .timestamp(LocalDateTime.now())
                .build());

        return mapper.toDto(saved);
    }

    @Transactional
    public ProjetDto update(Long id, ProjetDto dto) {
        Projet existing = projetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projet not found: " + id));
        existing.setNom(dto.getNom());
        existing.setDescription(dto.getDescription());
        existing.setDateDebut(dto.getDateDebut());
        existing.setDateFinPrevue(dto.getDateFinPrevue());
        existing.setDateFinReelle(dto.getDateFinReelle());
        if (dto.getStatut() != null) existing.setStatut(dto.getStatut());
        if (dto.getPriorite() != null) existing.setPriorite(dto.getPriorite());
        existing.setBudget(dto.getBudget());
        existing.setChefProjetId(dto.getChefProjetId());
        return mapper.toDto(projetRepository.save(existing));
    }

    @Transactional
    public void delete(Long id) {
        if (!projetRepository.existsById(id)) {
            throw new ResourceNotFoundException("Projet not found: " + id);
        }
        projetRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Projet> findEntity(Long id) {
        return projetRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Projet> findEnRetardEntities() {
        return projetRepository.findProjetsEnRetard(LocalDate.now());
    }

    @Transactional
    public void marquerEnRetard(Projet projet) {
        if (projet.getStatut() != ProjetStatut.EN_RETARD
                && projet.getStatut() != ProjetStatut.TERMINE
                && projet.getStatut() != ProjetStatut.ANNULE) {
            projet.setStatut(ProjetStatut.EN_RETARD);
            projetRepository.save(projet);
            eventPublisher.publishProjetLate(ProjetEvent.builder()
                    .projetId(projet.getId())
                    .nom(projet.getNom())
                    .type("LATE")
                    .timestamp(LocalDateTime.now())
                    .build());
        }
    }
}
