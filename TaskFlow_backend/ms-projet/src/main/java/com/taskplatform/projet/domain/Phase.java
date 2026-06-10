package com.taskplatform.projet.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "phase")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Phase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String nom;

    private Integer ordre;

    private LocalDate dateDebut;
    private LocalDate dateFin;

    private Double pourcentageAvancement;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projet_id", nullable = false)
    @JsonBackReference
    private Projet projet;
}
