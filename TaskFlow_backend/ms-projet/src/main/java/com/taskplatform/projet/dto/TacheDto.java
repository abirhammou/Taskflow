package com.taskplatform.projet.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.time.LocalDate;

/**
 * DTO miroir de l'entite Tache cote ms-tache (a ajuster selon le contrat reel).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class TacheDto {
    private Long id;
    private Long projetId;
    private String titre;
    private String statut; // EN_ATTENTE, EN_COURS, TERMINEE
    private LocalDate dateDebut;
    private LocalDate dateFinPrevue;
    private LocalDate dateFinReelle;
    private Double pourcentageAvancement;
}
