package com.taskplatform.projet.dto;

import com.taskplatform.projet.domain.Priorite;
import com.taskplatform.projet.domain.ProjetStatut;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjetDto {
    private Long id;

    @NotBlank
    private String nom;

    private String description;

    @NotNull
    private LocalDate dateDebut;

    @NotNull
    private LocalDate dateFinPrevue;

    private LocalDate dateFinReelle;

    private ProjetStatut statut;
    private Priorite priorite;
    private Double budget;
    private Long chefProjetId;
}
