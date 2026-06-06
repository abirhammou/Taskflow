package com.taskplatform.projet.messaging;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${app.rabbitmq.exchange}")
    private String exchangeName;

    @Value("${app.rabbitmq.queues.projet-events}")
    private String projetEventsQueue;

    @Value("${app.rabbitmq.queues.tache-events}")
    private String tacheEventsQueue;

    @Value("${app.rabbitmq.routing-keys.projet-created}")
    private String rkProjetCreated;

    @Value("${app.rabbitmq.routing-keys.projet-late}")
    private String rkProjetLate;

    @Value("${app.rabbitmq.routing-keys.tache-completed}")
    private String rkTacheCompleted;

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(exchangeName, true, false);
    }

    @Bean
    public Queue projetEventsQueue() {
        return new Queue(projetEventsQueue, true);
    }

    @Bean
    public Queue tacheEventsQueue() {
        return new Queue(tacheEventsQueue, true);
    }

    @Bean
    public Binding bindingProjetCreated(Queue projetEventsQueue, TopicExchange exchange) {
        return BindingBuilder.bind(projetEventsQueue).to(exchange).with(rkProjetCreated);
    }

    @Bean
    public Binding bindingProjetLate(Queue projetEventsQueue, TopicExchange exchange) {
        return BindingBuilder.bind(projetEventsQueue).to(exchange).with(rkProjetLate);
    }

    @Bean
    public Binding bindingTacheCompleted(Queue tacheEventsQueue, TopicExchange exchange) {
        return BindingBuilder.bind(tacheEventsQueue).to(exchange).with(rkTacheCompleted);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory cf, MessageConverter mc) {
        RabbitTemplate template = new RabbitTemplate(cf);
        template.setMessageConverter(mc);
        return template;
    }
}
