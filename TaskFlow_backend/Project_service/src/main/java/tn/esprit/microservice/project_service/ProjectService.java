package tn.esprit.microservice.project_service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.microservice.project_service.messaging.RabbitMQConfig;
import tn.esprit.microservice.project_service.messaging.TaskAssignedEvent;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final RabbitTemplate rabbitTemplate;

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    public Project assignTaskToProject(Long projectId, Long taskId,
                                       String taskTitle, String assignedBy) {
        Project project = getProjectById(projectId);

        if (!project.getTaskIds().contains(taskId)) {
            project.getTaskIds().add(taskId);
            projectRepository.save(project);
        }

        // Publish event to RabbitMQ
        TaskAssignedEvent event = new TaskAssignedEvent(taskId, projectId, taskTitle, assignedBy);
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.ROUTING_KEY,
                event
        );
        System.out.println("📤 Published task assignment event: " + event);

        return project;
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}
