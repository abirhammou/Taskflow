package tn.esprit.microservice.task_service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.microservice.task_service.messaging.TaskEventPublisher;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService implements ITaskService{

    private final TaskRepository taskRepository;
    private final TaskEventPublisher taskEventPublisher;

    @Override
    public Task addTask(Task task) {
        return taskRepository.save(task);
    }

    @Override
    public Task updateTask(Long id, Task task) {

        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        boolean wasCompleted = existingTask.isCompleted(); // état avant update

        existingTask.setTitle(task.getTitle());
        existingTask.setDescription(task.getDescription());
        existingTask.setDueDate(task.getDueDate());
        existingTask.setCompleted(task.isCompleted());

        Task saved = taskRepository.save(existingTask);

        // =========================
        // RABBITMQ EVENT
        // =========================
        if (!wasCompleted && saved.isCompleted() && saved.getTeamId() != null) {
            taskEventPublisher.publishTaskCompleted(saved.getTeamId());
        }

        return saved;
    }






    @Override
    public void deleteTask(Long id) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        taskRepository.deleteById(id);

        // =========================
        // RABBITMQ EVENT
        // =========================
        if (task.getTeamId() != null) {
            taskEventPublisher.publishTaskDeleted(task.getTeamId());
        }
    }
    @Override
    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    public TaskStatsDTO getStats() {

        long total = taskRepository.count();
        long completed = taskRepository.countByCompleted(true);
        long pending = taskRepository.countByCompleted(false);
        long overdue = taskRepository.countOverdueTasks();

        double completionRate = (total == 0) ? 0 : (completed * 100.0 / total);

        return new TaskStatsDTO(
                total,
                completed,
                pending,
                overdue,
                completionRate
        );
    }

}
