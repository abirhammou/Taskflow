package com.taskplatform.projet.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KpiDto {
    private Long projetId;
    private LocalDateTime dateCalcul;
    private Double tauxAvancement;
    private Double delaiMoyenTaches;
    private Integer nbTachesEnRetard;
    private Integer nbTachesTotal;
    private Integer nbTachesTerminees;
}
