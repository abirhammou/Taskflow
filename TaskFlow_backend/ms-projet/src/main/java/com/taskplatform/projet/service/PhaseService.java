package com.taskplatform.projet.service;

import com.taskplatform.projet.domain.Phase;
import com.taskplatform.projet.domain.Projet;
import com.taskplatform.projet.dto.PhaseDto;
import com.taskplatform.projet.exception.ResourceNotFoundException;
import com.taskplatform.projet.mapper.ProjetMapper;
import com.taskplatform.projet.repository.PhaseRepository;
import com.taskplatform.projet.repository.ProjetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PhaseService {

    private final PhaseRepository phaseRepository;
    private final ProjetRepository projetRepository;
    private final ProjetMapper mapper;

    @Transactional(readOnly = true)
    public List<PhaseDto> findByProjet(Long projetId) {
        return phaseRepository.findByProjetId(projetId).stream().map(mapper::toPhaseDto).toList();
    }

    @Transactional
    public PhaseDto create(Long projetId, PhaseDto dto) {
        Projet projet = projetRepository.findById(projetId)
                .orElseThrow(() -> new ResourceNotFoundException("Projet not found: " + projetId));
        Phase phase = mapper.toPhaseEntity(dto);
        phase.setProjet(projet);
        return mapper.toPhaseDto(phaseRepository.save(phase));
    }

    @Transactional
    public PhaseDto update(Long phaseId, PhaseDto dto) {
        Phase existing = phaseRepository.findById(phaseId)
                .orElseThrow(() -> new ResourceNotFoundException("Phase not found: " + phaseId));
        existing.setNom(dto.getNom());
        existing.setOrdre(dto.getOrdre());
        existing.setDateDebut(dto.getDateDebut());
        existing.setDateFin(dto.getDateFin());
        existing.setPourcentageAvancement(dto.getPourcentageAvancement());
        return mapper.toPhaseDto(phaseRepository.save(existing));
    }

    @Transactional
    public void delete(Long phaseId) {
        if (!phaseRepository.existsById(phaseId)) {
            throw new ResourceNotFoundException("Phase not found: " + phaseId);
        }
        phaseRepository.deleteById(phaseId);
    }
}
