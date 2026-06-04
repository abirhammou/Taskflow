package tn.esprit.microservice.task_service;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/task")
@RequiredArgsConstructor
public class TaskRestApi {

    private final ITaskService taskService;

    @PostMapping("/add")
    public Task addTask(@Valid @RequestBody TaskDTO taskDTO) {
        Task task = new Task();
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setDueDate(taskDTO.getDueDate());
        task.setCompleted(taskDTO.isCompleted());

        return taskService.addTask(task);
    }

    @PutMapping("/update/{id}")
    public Task updateTask(@PathVariable Long id, @Valid @RequestBody TaskDTO taskDTO) {
        Task task = new Task();
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setDueDate(taskDTO.getDueDate());
        task.setCompleted(taskDTO.isCompleted());

        return taskService.updateTask(id, task);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }

    @GetMapping("/get/{id}")
    public Task getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }

    @GetMapping("/getAll")
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    @GetMapping("/stats")
    public TaskStatsDTO getStats() {
        return taskService.getStats();
    }

}
