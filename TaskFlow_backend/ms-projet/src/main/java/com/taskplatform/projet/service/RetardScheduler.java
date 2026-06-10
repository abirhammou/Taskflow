package com.taskplatform.projet.service;

import com.taskplatform.projet.domain.Projet;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class RetardScheduler {

    private final ProjetService projetService;

    /**
     * Toutes les 5 minutes, detecte les projets dont la date de fin prevue est depassee
     * et les marque en EN_RETARD (publie aussi un event RabbitMQ).
     */
    @Scheduled(fixedDelay = 300_000L, initialDelay = 30_000L)
    public void detecterRetards() {
        List<Projet> retards = projetService.findEnRetardEntities();
        if (!retards.isEmpty()) {
            log.info("Detected {} projets en retard", retards.size());
            retards.forEach(projetService::marquerEnRetard);
        }
    }
}
