package com.taskplatform.projet.service;

import com.taskplatform.projet.client.TacheClient;
import com.taskplatform.projet.domain.KpiSnapshot;
import com.taskplatform.projet.domain.Projet;
import com.taskplatform.projet.dto.KpiDto;
import com.taskplatform.projet.dto.TacheDto;
import com.taskplatform.projet.exception.ResourceNotFoundException;
import com.taskplatform.projet.repository.KpiSnapshotRepository;
import com.taskplatform.projet.repository.ProjetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class KpiService {

    private final ProjetRepository projetRepository;
    private final KpiSnapshotRepository kpiSnapshotRepository;
    private final TacheClient tacheClient;

    /**
     * Calcul des KPI en temps reel via OpenFeign vers ms-tache.
     * Tolerant a l'indisponibilite de ms-tache (retourne KPI vides).
     */
    @Transactional(readOnly = true)
    public KpiDto computeKpi(Long projetId) {
        Projet projet = projetRepository.findById(projetId)
                .orElseThrow(() -> new ResourceNotFoundException("Projet not found: " + projetId));

        List<TacheDto> taches;
        try {
            taches = tacheClient.findByProjetId(projetId);
        } catch (Exception e) {
            log.warn("ms-tache unreachable for projet {}: {}", projetId, e.getMessage());
            taches = Collections.emptyList();
        }

        return buildKpi(projet, taches);
    }

    @Transactional
    public KpiSnapshot snapshotKpi(Long projetId) {
        KpiDto kpi = computeKpi(projetId);
        KpiSnapshot snapshot = KpiSnapshot.builder()
                .projetId(projetId)
                .dateCalcul(kpi.getDateCalcul())
                .tauxAvancement(kpi.getTauxAvancement())
                .delaiMoyenTaches(kpi.getDelaiMoyenTaches())
                .nbTachesEnRetard(kpi.getNbTachesEnRetard())
                .nbTachesTotal(kpi.getNbTachesTotal())
                .nbTachesTerminees(kpi.getNbTachesTerminees())
                .build();
        return kpiSnapshotRepository.save(snapshot);
    }

    @Transactional(readOnly = true)
    public List<KpiSnapshot> historique(Long projetId) {
        return kpiSnapshotRepository.findByProjetIdOrderByDateCalculDesc(projetId);
    }

    private KpiDto buildKpi(Projet projet, List<TacheDto> taches) {
        int total = taches.size();
        int terminees = (int) taches.stream()
                .filter(t -> "TERMINEE".equalsIgnoreCase(t.getStatut()))
                .count();
        LocalDate today = LocalDate.now();
        int enRetard = (int) taches.stream()
                .filter(t -> t.getDateFinPrevue() != null
                        && t.getDateFinPrevue().isBefore(today)
                        && !"TERMINEE".equalsIgnoreCase(t.getStatut()))
                .count();

        double taux;
        if (total == 0) {
            taux = 0d;
        } else {
            double sumPct = taches.stream()
                    .mapToDouble(t -> t.getPourcentageAvancement() != null
                            ? t.getPourcentageAvancement()
                            : ("TERMINEE".equalsIgnoreCase(t.getStatut()) ? 100d : 0d))
                    .sum();
            taux = sumPct / total;
        }

        double delaiMoyen = taches.stream()
                .filter(t -> t.getDateDebut() != null && t.getDateFinReelle() != null)
                .mapToLong(t -> ChronoUnit.DAYS.between(t.getDateDebut(), t.getDateFinReelle()))
                .average()
                .orElse(0d);

        return KpiDto.builder()
                .projetId(projet.getId())
                .dateCalcul(LocalDateTime.now())
                .tauxAvancement(taux)
                .delaiMoyenTaches(delaiMoyen)
                .nbTachesEnRetard(enRetard)
                .nbTachesTotal(total)
                .nbTachesTerminees(terminees)
                .build();
    }
}
