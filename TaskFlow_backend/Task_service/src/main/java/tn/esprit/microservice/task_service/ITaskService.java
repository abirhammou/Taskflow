package tn.esprit.microservice.task_service;

import java.util.List;

public interface ITaskService {

    Task addTask(Task task, String requesterId);
    Task updateTask(Long id, Task task);
    void deleteTask(Long id, String requesterId);
    TaskWithUserDTO getTaskById(Long id);
    List<Task> getAllTasks();
    List<Task> getTasksByUserId(String userId);           // ← add
    List<TaskWithUserDTO> getAllTasksWithUsers();          // ← add
    TaskStatsDTO getStats();
}
