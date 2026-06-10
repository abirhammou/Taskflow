package com.taskplatform.projet.messaging;

import com.taskplatform.projet.messaging.events.TacheCompletedEvent;
import com.taskplatform.projet.service.KpiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TacheEventListener {

    private final KpiService kpiService;

    @RabbitListener(queues = "${app.rabbitmq.queues.tache-events}")
    public void onTacheCompleted(TacheCompletedEvent event) {
        log.info("Received tache.completed event: tacheId={} projetId={}",
                event.getTacheId(), event.getProjetId());
        if (event.getProjetId() != null) {
            kpiService.snapshotKpi(event.getProjetId());
        }
    }
}
