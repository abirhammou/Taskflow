package com.taskplatform.projet.mapper;

import com.taskplatform.projet.domain.Phase;
import com.taskplatform.projet.domain.Projet;
import com.taskplatform.projet.dto.PhaseDto;
import com.taskplatform.projet.dto.ProjetDto;
import org.springframework.stereotype.Component;

@Component
public class ProjetMapper {

    public ProjetDto toDto(Projet p) {
        if (p == null) return null;
        return ProjetDto.builder()
                .id(p.getId())
                .nom(p.getNom())
                .description(p.getDescription())
                .dateDebut(p.getDateDebut())
                .dateFinPrevue(p.getDateFinPrevue())
                .dateFinReelle(p.getDateFinReelle())
                .statut(p.getStatut())
                .priorite(p.getPriorite())
                .budget(p.getBudget())
                .chefProjetId(p.getChefProjetId())
                .build();
    }

    public Projet toEntity(ProjetDto d) {
        if (d == null) return null;
        return Projet.builder()
                .id(d.getId())
                .nom(d.getNom())
                .description(d.getDescription())
                .dateDebut(d.getDateDebut())
                .dateFinPrevue(d.getDateFinPrevue())
                .dateFinReelle(d.getDateFinReelle())
                .statut(d.getStatut())
                .priorite(d.getPriorite())
                .budget(d.getBudget())
                .chefProjetId(d.getChefProjetId())
                .build();
    }

    public PhaseDto toPhaseDto(Phase ph) {
        if (ph == null) return null;
        return PhaseDto.builder()
                .id(ph.getId())
                .nom(ph.getNom())
                .ordre(ph.getOrdre())
                .dateDebut(ph.getDateDebut())
                .dateFin(ph.getDateFin())
                .pourcentageAvancement(ph.getPourcentageAvancement())
                .projetId(ph.getProjet() != null ? ph.getProjet().getId() : null)
                .build();
    }

    public Phase toPhaseEntity(PhaseDto d) {
        if (d == null) return null;
        return Phase.builder()
                .id(d.getId())
                .nom(d.getNom())
                .ordre(d.getOrdre())
                .dateDebut(d.getDateDebut())
                .dateFin(d.getDateFin())
                .pourcentageAvancement(d.getPourcentageAvancement())
                .build();
    }
}
