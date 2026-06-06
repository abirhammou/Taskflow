package com.taskplatform.projet.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "kpi_snapshot")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KpiSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long projetId;

    @Column(nullable = false)
    private LocalDateTime dateCalcul;

    private Double tauxAvancement;
    private Double delaiMoyenTaches;
    private Integer nbTachesEnRetard;
    private Integer nbTachesTotal;
    private Integer nbTachesTerminees;
}
