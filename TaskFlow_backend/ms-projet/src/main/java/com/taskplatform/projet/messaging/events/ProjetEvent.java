package com.taskplatform.projet.messaging.events;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjetEvent {
    private Long projetId;
    private String nom;
    private String type; // CREATED, LATE, etc.
    private LocalDateTime timestamp;
}
