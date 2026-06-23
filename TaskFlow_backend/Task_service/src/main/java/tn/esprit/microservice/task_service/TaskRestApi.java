package tn.esprit.microservice.task_service;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/task")
@RequiredArgsConstructor
@Tag(name = "Task API", description = "Gestion des tâches (CRUD + statistiques)")
public class TaskRestApi {

    private final ITaskService taskService;

    @PostMapping("/add")
    @Operation(summary = "Ajouter une nouvelle tâche", description = "Crée une tâche à partir des données fournies")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tâche créée avec succès",
                    content = @Content(schema = @Schema(implementation = Task.class))),
            @ApiResponse(responseCode = "400", description = "Données invalides (validation échouée)")
    })
    public Task addTask(@Valid @RequestBody TaskDTO taskDTO,
                        @RequestParam String requesterId) {
        Task task = new Task();
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setDueDate(taskDTO.getDueDate());
        task.setCompleted(taskDTO.isCompleted());
        task.setUserId(taskDTO.getUserId());
        return taskService.addTask(task, requesterId);   // ← now passes both arguments
    }

    @PutMapping("/update/{id}")
    @Operation(summary = "Mettre à jour une tâche", description = "Modifie une tâche existante")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tâche mise à jour",
                    content = @Content(schema = @Schema(implementation = Task.class))),
            @ApiResponse(responseCode = "400", description = "Données invalides"),
            @ApiResponse(responseCode = "404", description = "Tâche non trouvée")
    })
    public Task updateTask(@PathVariable Long id, @Valid @RequestBody TaskDTO taskDTO) {
        Task task = new Task();
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setDueDate(taskDTO.getDueDate());
        task.setCompleted(taskDTO.isCompleted());
        task.setUserId(taskDTO.getUserId());
        return taskService.updateTask(id, task);
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Supprimer une tâche", description = "Supprime la tâche correspondant à l'ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Suppression réussie"),
            @ApiResponse(responseCode = "404", description = "Tâche non trouvée")
    })
    public void deleteTask(@PathVariable Long id,
                           @RequestParam String requesterId) {
        taskService.deleteTask(id, requesterId);
    }

    @GetMapping("/get/{id}")
    @Operation(summary = "Récupérer une tâche par son ID", description = "Retourne les détails d'une tâche")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tâche trouvée",
                    content = @Content(schema = @Schema(implementation = Task.class))),
            @ApiResponse(responseCode = "404", description = "Tâche inexistante")
    })
    public TaskWithUserDTO getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }

    @GetMapping("/getAll")
    @Operation(summary = "Obtenir toutes les tâches", description = "Liste complète des tâches")
    @ApiResponse(responseCode = "200", description = "Liste retournée",
            content = @Content(schema = @Schema(implementation = List.class)))
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    @GetMapping("/stats")
    @Operation(summary = "Statistiques des tâches", description = "Nombre total, complétées, en attente, etc.")
    @ApiResponse(responseCode = "200", description = "Statistiques calculées",
            content = @Content(schema = @Schema(implementation = TaskStatsDTO.class)))
    public TaskStatsDTO getStats() {
        return taskService.getStats();
    }

    @GetMapping("/getByUser/{userId}")
    @Operation(summary = "Get tasks by user ID", description = "Returns only tasks belonging to a specific user")
    @ApiResponse(responseCode = "200", description = "Tasks returned")
    public List<Task> getTasksByUser(@PathVariable String userId) {
        return taskService.getTasksByUserId(userId);
    }

    @GetMapping("/getAllWithUsers")
    @Operation(summary = "Get all tasks with assignee info", description = "Admin view — all tasks enriched with user details")
    @ApiResponse(responseCode = "200", description = "Tasks with user info returned")
    public List<TaskWithUserDTO> getAllTasksWithUsers() {
        return taskService.getAllTasksWithUsers();
    }
}