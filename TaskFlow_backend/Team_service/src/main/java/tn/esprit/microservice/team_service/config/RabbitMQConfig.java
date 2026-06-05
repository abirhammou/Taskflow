package tn.esprit.microservice.team_service.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Scénario 1: Team supprimée → Task Service
    public static final String TEAM_DELETED_QUEUE = "team.deleted.queue";
    public static final String TEAM_DELETED_EXCHANGE = "team.exchange";
    public static final String TEAM_DELETED_KEY = "team.deleted";

    // Scénario 2: Task complétée → Team Service
    public static final String TASK_COMPLETED_QUEUE = "task.completed.queue";
    public static final String TASK_COMPLETED_EXCHANGE = "task.exchange";
    public static final String TASK_COMPLETED_KEY = "task.completed";

    @Bean
    public Queue teamDeletedQueue() {
        return new Queue(TEAM_DELETED_QUEUE, true);
    }

    @Bean
    public Queue taskCompletedQueue() {
        return new Queue(TASK_COMPLETED_QUEUE, true);
    }

    @Bean
    public TopicExchange teamExchange() {
        return new TopicExchange(TEAM_DELETED_EXCHANGE);
    }

    @Bean
    public TopicExchange taskExchange() {
        return new TopicExchange(TASK_COMPLETED_EXCHANGE);
    }

    @Bean
    public Binding teamDeletedBinding() {
        return BindingBuilder.bind(teamDeletedQueue())
                .to(teamExchange())
                .with(TEAM_DELETED_KEY);
    }

    @Bean
    public Binding taskCompletedBinding() {
        return BindingBuilder.bind(taskCompletedQueue())
                .to(taskExchange())
                .with(TASK_COMPLETED_KEY);
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }
}