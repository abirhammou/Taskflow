package tn.esprit.microservice.task_service.messaging;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import tn.esprit.microservice.task_service.RabbitMQConfig;
import tn.esprit.microservice.task_service.TaskRepository;

@Component
@RequiredArgsConstructor
public class TeamEventConsumer {

    private final TaskRepository taskRepository;

    @RabbitListener(queues = RabbitMQConfig.TEAM_DELETED_QUEUE)
    public void onTeamDeleted(Long teamId) {
        System.out.println("Team deleted received: " + teamId);
        taskRepository.deleteByTeamId(teamId);
    }
}