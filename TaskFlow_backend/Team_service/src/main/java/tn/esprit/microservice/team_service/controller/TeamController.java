package tn.esprit.microservice.team_service.controller;

import tn.esprit.microservice.team_service.entity.Team;
import tn.esprit.microservice.team_service.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    // GET toutes les équipes
    @GetMapping
    public ResponseEntity<List<Team>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    // GET équipe par ID
    @GetMapping("/{id}")
    public ResponseEntity<Team> getTeamById(@PathVariable Long id) {
        return ResponseEntity.ok(teamService.getTeamById(id));
    }

    // POST créer une équipe
    @PostMapping
    public ResponseEntity<Team> createTeam(@RequestBody Team team) {
        return new ResponseEntity<>(teamService.createTeam(team), HttpStatus.CREATED);
    }

    // PUT mettre à jour une équipe
    @PutMapping("/{id}")
    public ResponseEntity<Team> updateTeam(@PathVariable Long id, @RequestBody Team team) {
        return ResponseEntity.ok(teamService.updateTeam(id, team));
    }

    // DELETE supprimer une équipe
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
        return ResponseEntity.noContent().build();
    }

    // GET équipes par département
    @GetMapping("/department/{department}")
    public ResponseEntity<List<Team>> getTeamsByDepartment(@PathVariable String department) {
        return ResponseEntity.ok(teamService.getTeamsByDepartment(department));
    }

    // GET équipes actives seulement
    @GetMapping("/active")
    public ResponseEntity<List<Team>> getActiveTeams() {
        return ResponseEntity.ok(teamService.getActiveTeams());
    }

    // PUT incrémenter le nombre de membres
    @PutMapping("/{id}/increment-members")
    public ResponseEntity<Team> incrementMemberCount(@PathVariable Long id) {
        return ResponseEntity.ok(teamService.incrementMemberCount(id));
    }

    // PUT décrémenter le nombre de membres
    @PutMapping("/{id}/decrement-members")
    public ResponseEntity<Team> decrementMemberCount(@PathVariable Long id) {
        return ResponseEntity.ok(teamService.decrementMemberCount(id));
    }
}
