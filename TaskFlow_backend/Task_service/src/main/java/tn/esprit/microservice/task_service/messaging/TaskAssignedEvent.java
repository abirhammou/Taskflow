package tn.esprit.microservice.task_service.messaging;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskAssignedEvent {
    private Long taskId;
    private Long projectId;
    private String taskTitle;
    private String assignedBy;
}
