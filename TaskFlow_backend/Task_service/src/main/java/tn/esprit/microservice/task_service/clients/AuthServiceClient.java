package tn.esprit.microservice.task_service.clients;  

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "auth-service", url = "http://localhost:3000")
public interface AuthServiceClient {

    @GetMapping("/auth/users/{id}")
    Object getUserById(@PathVariable("id") String id);

    @GetMapping("/auth/validate")
    Object validateToken(@RequestHeader("Authorization") String token);
}