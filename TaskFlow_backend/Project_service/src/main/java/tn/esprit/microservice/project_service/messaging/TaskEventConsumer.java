package tn.esprit.microservice.project_service.messaging;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;
import tn.esprit.microservice.project_service.Project;
import tn.esprit.microservice.project_service.ProjectRepository;
import com.rabbitmq.client.Channel;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class TaskEventConsumer {

    private final ProjectRepository projectRepository;

    @RabbitListener(queues = RabbitMQConfig.QUEUE, ackMode = "MANUAL")
    public void handleTaskAssigned(
            TaskAssignedEvent event,
            Channel channel,
            @Header(AmqpHeaders.DELIVERY_TAG) long tag) throws IOException {

        try {
            System.out.println("📨 Received task assignment: " + event);

            projectRepository.findById(event.getProjectId()).ifPresent(project -> {
                if (!project.getTaskIds().contains(event.getTaskId())) {
                    project.getTaskIds().add(event.getTaskId());
                    projectRepository.save(project);
                    System.out.println("✅ Task " + event.getTaskId()
                            + " added to project " + project.getName());
                }
            });

            channel.basicAck(tag, false);  // ← acknowledge success, stop redelivery

        } catch (Exception e) {
            System.err.println("❌ Failed to process event: " + e.getMessage());
            channel.basicNack(tag, false, false);  // ← reject without requeue
        }
    }
}
