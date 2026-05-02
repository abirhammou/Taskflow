package tn.esprit.microservice.team_service.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.esprit.microservice.team_service.DTO.TeamDTO;
import tn.esprit.microservice.team_service.entity.Team;
import tn.esprit.microservice.team_service.repository.TeamRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;

    // =========================
    // GET ALL TEAMS
    // =========================
    public List<TeamDTO> getAllTeams() {
        return teamRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // =========================
    // GET BY ID
    // =========================
    public TeamDTO getTeamById(Long id) {
        return toDTO(getEntityById(id));
    }

    // =========================
    // CREATE TEAM
    // =========================
    @Transactional
    public TeamDTO createTeam(TeamDTO dto) {

        if (teamRepository.existsByName(dto.getName())) {
            throw new RuntimeException("Team already exists with name: " + dto.getName());
        }

        Team team = toEntity(dto);
        Team saved = teamRepository.save(team);

        return toDTO(saved);
    }

    // =========================
    // UPDATE TEAM
    // =========================
    @Transactional
    public TeamDTO updateTeam(Long id, TeamDTO dto) {

        Team team = getEntityById(id);

        team.setName(dto.getName());
        team.setDescription(dto.getDescription());
        team.setDepartment(dto.getDepartment());
        team.setManagerId(dto.getManagerId());
        team.setMemberCount(dto.getMemberCount());
        team.setIsActive(dto.getIsActive());

        return toDTO(teamRepository.save(team));
    }

    // =========================
    // DELETE TEAM
    // =========================
    @Transactional
    public void deleteTeam(Long id) {
        Team team = getEntityById(id);
        teamRepository.delete(team);
    }

    // =========================
    // GET BY DEPARTMENT
    // =========================
    public List<TeamDTO> getTeamsByDepartment(String department) {
        return teamRepository.findByDepartment(department)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // =========================
    // GET ACTIVE TEAMS
    // =========================
    public List<TeamDTO> getActiveTeams() {
        return teamRepository.findByIsActiveTrue()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // =========================
    // INCREMENT MEMBER COUNT
    // =========================
    @Transactional
    public TeamDTO incrementMemberCount(Long id) {
        Team team = getEntityById(id);
        team.setMemberCount(team.getMemberCount() + 1);
        return toDTO(teamRepository.save(team));
    }

    // =========================
    // DECREMENT MEMBER COUNT
    // =========================
    @Transactional
    public TeamDTO decrementMemberCount(Long id) {
        Team team = getEntityById(id);
        team.setMemberCount(Math.max(0, team.getMemberCount() - 1));
        return toDTO(teamRepository.save(team));
    }

    // =========================
    // PRIVATE HELPERS
    // =========================
    private Team getEntityById(Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found with id: " + id));
    }

    // =========================
    // ENTITY -> DTO
    // =========================
    private TeamDTO toDTO(Team team) {
        TeamDTO dto = new TeamDTO();

        dto.setId(team.getId());
        dto.setName(team.getName());
        dto.setDescription(team.getDescription());
        dto.setDepartment(team.getDepartment());
        dto.setManagerId(team.getManagerId());
        dto.setMemberCount(team.getMemberCount());
        dto.setIsActive(team.getIsActive());
        dto.setCreatedAt(team.getCreatedAt());

        return dto;
    }

    // =========================
    // DTO -> ENTITY
    // =========================
    private Team toEntity(TeamDTO dto) {
        Team team = new Team();

        team.setId(dto.getId());
        team.setName(dto.getName());
        team.setDescription(dto.getDescription());
        team.setDepartment(dto.getDepartment());
        team.setManagerId(dto.getManagerId());
        team.setMemberCount(dto.getMemberCount() != null ? dto.getMemberCount() : 0);
        team.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);

        return team;
    }
}