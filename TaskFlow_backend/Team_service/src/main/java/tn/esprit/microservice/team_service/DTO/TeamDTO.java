package tn.esprit.microservice.team_service.DTO;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TeamDTO {

    private Long id;

    @NotNull(message = "Name is required")
    @Size(min = 3, message = "Min 3 characters")
    private String name;

    private String description;
    private String department;
    private Long managerId;
    private Integer memberCount;
    private Boolean isActive;
    private LocalDateTime createdAt;
}