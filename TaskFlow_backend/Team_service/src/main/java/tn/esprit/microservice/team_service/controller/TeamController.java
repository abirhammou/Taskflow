package tn.esprit.microservice.team_service.controller;
import tn.esprit.microservice.team_service.client.TaskFeignClient;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.microservice.team_service.DTO.TeamDTO;
import tn.esprit.microservice.team_service.service.TeamService;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;
    private final TaskFeignClient taskFeignClient;


    // =========================
    // GET ALL TEAMS
    // =========================
    @GetMapping
    public ResponseEntity<List<TeamDTO>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    // =========================
    // GET BY ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<TeamDTO> getTeamById(@PathVariable Long id) {
        return ResponseEntity.ok(teamService.getTeamById(id));
    }

    // =========================
    // CREATE TEAM
    // =========================
    @PostMapping
    public ResponseEntity<TeamDTO> createTeam(@RequestBody TeamDTO dto) {
        return new ResponseEntity<>(teamService.createTeam(dto), HttpStatus.CREATED);
    }

    // =========================
    // UPDATE TEAM
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<TeamDTO> updateTeam(
            @PathVariable Long id,
            @RequestBody TeamDTO dto) {
        return ResponseEntity.ok(teamService.updateTeam(id, dto));
    }

    // =========================
    // DELETE TEAM
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
        return ResponseEntity.noContent().build();
    }

    // =========================
    // GET BY DEPARTMENT
    // =========================
    @GetMapping("/department/{department}")
    public ResponseEntity<List<TeamDTO>> getTeamsByDepartment(@PathVariable String department) {
        return ResponseEntity.ok(teamService.getTeamsByDepartment(department));
    }

    // =========================
    // GET ACTIVE TEAMS
    // =========================
    @GetMapping("/active")
    public ResponseEntity<List<TeamDTO>> getActiveTeams() {
        return ResponseEntity.ok(teamService.getActiveTeams());
    }

    // =========================
    // INCREMENT MEMBER COUNT
    // =========================
    @PutMapping("/{id}/increment-members")
    public ResponseEntity<TeamDTO> incrementMemberCount(@PathVariable Long id) {
        return ResponseEntity.ok(teamService.incrementMemberCount(id));
    }

   
    @PutMapping("/{id}/decrement-members")
    public ResponseEntity<TeamDTO> decrementMemberCount(@PathVariable Long id) {
        return ResponseEntity.ok(teamService.decrementMemberCount(id));
    }


    // FEIGN - GET ALL TASKS
    @GetMapping("/feign/tasks")
    public ResponseEntity<List<Object>> getAllTasks() {
        return ResponseEntity.ok(taskFeignClient.getAllTasks());
    }

    // FEIGN - GET TASK STATS
    @GetMapping("/feign/tasks/stats")
    public ResponseEntity<Object> getTaskStats() {
        return ResponseEntity.ok(taskFeignClient.getTaskStats());
    }

    // FEIGN - GET TASK BY ID
    @GetMapping("/feign/tasks/{id}")
    public ResponseEntity<Object> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskFeignClient.getTaskById(id));
    }
}