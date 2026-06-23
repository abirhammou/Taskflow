package tn.esprit.microservice.project_service.messaging;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)

public class TaskAssignedEvent {

    private Long taskId;
    private Long projectId;
    private String taskTitle;
    private String assignedBy;
}
