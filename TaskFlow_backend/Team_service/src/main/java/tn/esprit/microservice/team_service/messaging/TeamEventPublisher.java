package tn.esprit.microservice.team_service.messaging;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;
import tn.esprit.microservice.team_service.config.RabbitMQConfig;

@Component
@RequiredArgsConstructor
public class TeamEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishTeamDeleted(Long teamId) {
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.TEAM_DELETED_EXCHANGE,
                RabbitMQConfig.TEAM_DELETED_KEY,
                teamId
        );
        System.out.println("Team deleted sent: " + teamId);
    }
}