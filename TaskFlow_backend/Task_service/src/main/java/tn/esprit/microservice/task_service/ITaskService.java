package tn.esprit.microservice.task_service;

import java.util.List;

public interface ITaskService {

    Task addTask(Task task);
    Task updateTask(Long id, Task task);
    void deleteTask(Long id);
    Task getTaskById(Long id);
    List<Task> getAllTasks();
    TaskStatsDTO getStats();
}
