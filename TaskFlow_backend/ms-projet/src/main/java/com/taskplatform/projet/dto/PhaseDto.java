package com.taskplatform.projet.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PhaseDto {
    private Long id;

    @NotBlank
    private String nom;

    private Integer ordre;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Double pourcentageAvancement;
    private Long projetId;
}
