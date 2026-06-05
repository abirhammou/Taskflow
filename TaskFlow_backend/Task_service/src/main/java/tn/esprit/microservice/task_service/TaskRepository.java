package tn.esprit.microservice.task_service;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TaskRepository extends JpaRepository<Task, Long> {

    long countByCompleted(boolean completed);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.dueDate < CURRENT_DATE AND t.completed = false")
    long countOverdueTasks();
    void deleteByTeamId(Long teamId);
}
