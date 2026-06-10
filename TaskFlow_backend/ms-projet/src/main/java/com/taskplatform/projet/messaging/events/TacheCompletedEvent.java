package com.taskplatform.projet.messaging.events;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class TacheCompletedEvent {
    private Long tacheId;
    private Long projetId;
    private String titre;
    private LocalDateTime dateCompletion;
}
