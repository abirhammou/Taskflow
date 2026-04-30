package tn.esprit.microservice.team_service.service;

import tn.esprit.microservice.team_service.entity.Team;
import tn.esprit.microservice.team_service.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;

    // Récupérer toutes les équipes
    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    // Récupérer une équipe par son ID
    public Team getTeamById(Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team non trouvée avec l'id: " + id));
    }

    // Créer une nouvelle équipe
    @Transactional
    public Team createTeam(Team team) {
        if (teamRepository.existsByName(team.getName())) {
            throw new RuntimeException("Une équipe avec le nom '" + team.getName() + "' existe déjà");
        }
        return teamRepository.save(team);
    }

    // Mettre à jour une équipe
    @Transactional
    public Team updateTeam(Long id, Team teamDetails) {
        Team team = getTeamById(id);
        team.setName(teamDetails.getName());
        team.setDescription(teamDetails.getDescription());
        team.setDepartment(teamDetails.getDepartment());
        team.setManagerId(teamDetails.getManagerId());
        team.setMemberCount(teamDetails.getMemberCount());
        team.setIsActive(teamDetails.getIsActive());
        return teamRepository.save(team);
    }

    // Supprimer une équipe
    @Transactional
    public void deleteTeam(Long id) {
        Team team = getTeamById(id);
        teamRepository.delete(team);
    }

    // Récupérer les équipes par département
    public List<Team> getTeamsByDepartment(String department) {
        return teamRepository.findByDepartment(department);
    }

    // Récupérer les équipes actives
    public List<Team> getActiveTeams() {
        return teamRepository.findByIsActiveTrue();
    }

    // Incrémenter le nombre de membres
    @Transactional
    public Team incrementMemberCount(Long id) {
        Team team = getTeamById(id);
        team.setMemberCount(team.getMemberCount() + 1);
        return teamRepository.save(team);
    }

    // Décrémenter le nombre de membres
    @Transactional
    public Team decrementMemberCount(Long id) {
        Team team = getTeamById(id);
        team.setMemberCount(Math.max(0, team.getMemberCount() - 1));
        return teamRepository.save(team);
    }
}
