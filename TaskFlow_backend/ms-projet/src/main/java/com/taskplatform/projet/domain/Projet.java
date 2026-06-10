package com.taskplatform.projet.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projet")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Projet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String nom;

    @Column(length = 2000)
    private String description;

    @NotNull
    private LocalDate dateDebut;

    @NotNull
    private LocalDate dateFinPrevue;

    private LocalDate dateFinReelle;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjetStatut statut;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priorite priorite;

    private Double budget;

    private Long chefProjetId;

    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Phase> phases = new ArrayList<>();
}
