package com.taskplatform.projet.client;

import com.taskplatform.projet.dto.TacheDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * Feign client vers le microservice ms-tache.
 * Le nom 'ms-tache' doit correspondre a spring.application.name du MS coequipier.
 * La valeur est externalisee via la propriete 'app.services.tache' dans application.yml.
 */
@FeignClient(name = "${app.services.tache}", path = "/api/taches")
public interface TacheClient {

    @GetMapping
    List<TacheDto> findByProjetId(@RequestParam("projetId") Long projetId);
}
