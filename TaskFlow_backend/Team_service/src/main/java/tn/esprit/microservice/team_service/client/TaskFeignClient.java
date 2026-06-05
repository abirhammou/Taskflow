package tn.esprit.microservice.team_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@FeignClient(name = "task-service")
public interface TaskFeignClient {

    @GetMapping("/task/getAll")
    List<Object> getAllTasks();

    @GetMapping("/task/get/{id}")
    Object getTaskById(@PathVariable Long id);

    @GetMapping("/task/stats")
    Object getTaskStats();
}