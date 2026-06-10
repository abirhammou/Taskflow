package com.taskflow.user_service.messaging;

import com.taskflow.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RabbitMQConsumer {

    private final UserService userService;

    @RabbitListener(queues = "task.completed.queue")
    public void handleTaskCompleted(String message) {
        System.out.println("Message reçu : " + message);
        try {
            Long userId = Long.parseLong(message.trim());
            userService.decrementTaskCount(userId);
            System.out.println("Tâche terminée pour user : " + userId);
        } catch (Exception e) {
            System.out.println("Erreur traitement message : " + e.getMessage());
        }
    }

    @RabbitListener(queues = "task.assigned.queue")
    public void handleTaskAssigned(String message) {
        System.out.println("Tâche assignée, message reçu : " + message);
        try {
            Long userId = Long.parseLong(message.trim());
            userService.incrementTaskCount(userId);
            System.out.println("Charge mise à jour pour user : " + userId);
        } catch (Exception e) {
            System.out.println("Erreur traitement message : " + e.getMessage());
        }
    }
}