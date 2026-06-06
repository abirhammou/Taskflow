package com.taskplatform.projet.repository;

import com.taskplatform.projet.domain.Priorite;
import com.taskplatform.projet.domain.Projet;
import com.taskplatform.projet.domain.ProjetStatut;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProjetRepository extends JpaRepository<Projet, Long> {

    List<Projet> findByStatut(ProjetStatut statut);

    List<Projet> findByPriorite(Priorite priorite);

    List<Projet> findByChefProjetId(Long chefProjetId);

    @Query("SELECT p FROM Projet p WHERE p.dateFinPrevue < :today AND p.statut <> 'TERMINE' AND p.statut <> 'ANNULE'")
    List<Projet> findProjetsEnRetard(LocalDate today);
}
