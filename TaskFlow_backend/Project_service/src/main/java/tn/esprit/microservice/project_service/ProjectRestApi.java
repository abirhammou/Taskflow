package tn.esprit.microservice.project_service;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/project")
@RequiredArgsConstructor
public class ProjectRestApi {

    private final ProjectService projectService;

    @PostMapping("/add")
    public Project createProject(@RequestBody Project project) {
        return projectService.createProject(project);
    }

    @GetMapping("/getAll")
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    @GetMapping("/get/{id}")
    public Project getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id);
    }

    @PostMapping("/{projectId}/assign-task")
    public Project assignTask(
            @PathVariable Long projectId,
            @RequestParam Long taskId,
            @RequestParam String taskTitle,
            @RequestParam String assignedBy) {
        return projectService.assignTaskToProject(projectId, taskId, taskTitle, assignedBy);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
    }
}
