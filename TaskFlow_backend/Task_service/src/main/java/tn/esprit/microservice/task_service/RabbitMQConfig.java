package tn.esprit.microservice.task_service;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String TEAM_DELETED_QUEUE = "team.deleted.queue";

    @Bean
    public Queue teamDeletedQueue() {
        return new Queue(TEAM_DELETED_QUEUE, true);
    }
}