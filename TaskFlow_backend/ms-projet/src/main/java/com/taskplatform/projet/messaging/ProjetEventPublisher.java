package com.taskplatform.projet.messaging;

import com.taskplatform.projet.messaging.events.ProjetEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ProjetEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    @Value("${app.rabbitmq.exchange}")
    private String exchange;

    @Value("${app.rabbitmq.routing-keys.projet-created}")
    private String rkProjetCreated;

    @Value("${app.rabbitmq.routing-keys.projet-late}")
    private String rkProjetLate;

    public void publishProjetCreated(ProjetEvent event) {
        publish(rkProjetCreated, event, "projet.created");
    }

    public void publishProjetLate(ProjetEvent event) {
        publish(rkProjetLate, event, "projet.late");
    }

    private void publish(String routingKey, ProjetEvent event, String label) {
        try {
            log.info("Publishing {} event: projetId={}", label, event.getProjetId());
            rabbitTemplate.convertAndSend(exchange, routingKey, event);
        } catch (Exception e) {
            log.warn("RabbitMQ unavailable, event {} not published: {}", label, e.getMessage());
        }
    }
}
