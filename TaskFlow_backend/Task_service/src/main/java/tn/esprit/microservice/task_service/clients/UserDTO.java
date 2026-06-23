package tn.esprit.microservice.task_service.clients;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserDTO {

    private String username;
    private String email;
    private String role;
}
