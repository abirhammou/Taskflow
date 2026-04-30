package tn.esprit.microservice.team_service.repository;

import tn.esprit.microservice.team_service.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {

    List<Team> findByDepartment(String department);

    List<Team> findByIsActiveTrue();

    boolean existsByName(String name);

    List<Team> findByManagerId(Long managerId);
}
