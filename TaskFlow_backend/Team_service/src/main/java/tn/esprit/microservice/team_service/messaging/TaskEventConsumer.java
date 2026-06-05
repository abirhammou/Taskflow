package tn.esprit.microservice.team_service.messaging;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import tn.esprit.microservice.team_service.config.RabbitMQConfig;
import tn.esprit.microservice.team_service.service.TeamService;

@Component
@RequiredArgsConstructor
public class TaskEventConsumer {

    private final TeamService teamService;

    @RabbitListener(queues = RabbitMQConfig.TASK_COMPLETED_QUEUE)
    public void onTaskCompleted(Long teamId) {
        System.out.println("Task completed received: " + teamId);
        teamService.decrementMemberCount(teamId);
    }
}