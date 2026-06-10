package com.taskflow.user_service.messaging;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@FeignClient(name = "task-service")
public interface TaskClient {

    @GetMapping("/tasks/user/{userId}")
    List<Object> getTasksByUserId(@PathVariable Long userId);
}