package tn.esprit.microservice.task_service.messaging;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TaskEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishTaskCompleted(Long teamId) {
        rabbitTemplate.convertAndSend(
                "task.exchange",
                "task.completed",
                teamId
        );
        System.out.println("Task completed sent: " + teamId);
    }


    public void publishTaskDeleted(Long teamId) {
        rabbitTemplate.convertAndSend(
                "task.exchange",
                "task.deleted",
                teamId
        );
    }
}
