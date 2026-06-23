package tn.esprit.microservice.task_service;

import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.microservice.task_service.clients.AuthServiceClient;
import tn.esprit.microservice.task_service.clients.UserDTO;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService implements ITaskService {

    private final TaskRepository taskRepository;
    private final AuthServiceClient authServiceClient;

    @Override
    public Task addTask(Task task, String requesterId) {
        UserDTO requester;
        try {
            requester = authServiceClient.getUserById(requesterId);
        } catch (FeignException.NotFound e) {
            throw new RuntimeException("Requesting user '" + requesterId + "' not found");
        }

        boolean isAdmin = requester != null && "ADMIN".equalsIgnoreCase(requester.getRole());

        if (!isAdmin && !requesterId.equals(task.getUserId())) {
            throw new RuntimeException("Users can only create tasks for themselves");
        }

        if (!requesterId.equals(task.getUserId())) {
            try {
                authServiceClient.getUserById(task.getUserId());
            } catch (FeignException.NotFound e) {
                throw new RuntimeException("Cannot create task: user '" + task.getUserId() + "' does not exist");
            }
        }

        return taskRepository.save(task);
    }

    @Override
    public Task updateTask(Long id, Task task) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        existingTask.setTitle(task.getTitle());
        existingTask.setDescription(task.getDescription());
        existingTask.setDueDate(task.getDueDate());
        existingTask.setCompleted(task.isCompleted());
        existingTask.setUserId(task.getUserId());

        return taskRepository.save(existingTask);
    }

    @Override
    public void deleteTask(Long id, String requesterId) {
        UserDTO requester;
        try {
            requester = authServiceClient.getUserById(requesterId);
        } catch (FeignException.NotFound e) {
            throw new RuntimeException("Requesting user '" + requesterId + "' not found");
        }

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        boolean isAdmin = requester != null && "ADMIN".equalsIgnoreCase(requester.getRole());
        boolean isOwner = task.getUserId().equals(requesterId);

        if (!isAdmin && !isOwner) {
            throw new RuntimeException("You can only delete your own tasks");
        }

        taskRepository.deleteById(id);
    }

    @Override
    public TaskWithUserDTO getTaskById(Long id) {
        // Scenario 2 — enrich the task with assignee info
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        UserDTO assignee = null;
        try {
            assignee = authServiceClient.getUserById(task.getUserId());
        } catch (FeignException.NotFound e) {
            // user was deleted after being assigned — leave assignee null, don't fail the request
        }

        return new TaskWithUserDTO(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.isCompleted(),
                task.getUserId(),
                assignee
        );
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

        return new TaskStatsDTO(total, completed, pending, overdue, completionRate);
    }

    @Override
    public List<Task> getTasksByUserId(String userId) {
        return taskRepository.findByUserId(userId);
    }

    @Override
    public List<TaskWithUserDTO> getAllTasksWithUsers() {
        return taskRepository.findAll().stream().map(task -> {
            UserDTO assignee = null;
            try {
                assignee = authServiceClient.getUserById(task.getUserId());
            } catch (FeignException.NotFound e) {
                // user deleted after task was created — leave null
            }
            return new TaskWithUserDTO(
                    task.getId(),
                    task.getTitle(),
                    task.getDescription(),
                    task.getDueDate(),
                    task.isCompleted(),
                    task.getUserId(),
                    assignee
            );
        }).collect(java.util.stream.Collectors.toList());
    }
}