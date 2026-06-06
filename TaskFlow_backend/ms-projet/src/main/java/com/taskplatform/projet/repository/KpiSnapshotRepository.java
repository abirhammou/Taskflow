package com.taskplatform.projet.repository;

import com.taskplatform.projet.domain.KpiSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KpiSnapshotRepository extends JpaRepository<KpiSnapshot, Long> {
    List<KpiSnapshot> findByProjetIdOrderByDateCalculDesc(Long projetId);
}
