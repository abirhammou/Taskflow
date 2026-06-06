package com.taskplatform.projet.web;

import com.taskplatform.projet.domain.KpiSnapshot;
import com.taskplatform.projet.dto.KpiDto;
import com.taskplatform.projet.service.KpiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kpi")
@RequiredArgsConstructor
public class KpiController {

    private final KpiService kpiService;

    @GetMapping("/projets/{projetId}")
    public KpiDto computeKpi(@PathVariable Long projetId) {
        return kpiService.computeKpi(projetId);
    }

    @PostMapping("/projets/{projetId}/snapshot")
    public KpiSnapshot snapshot(@PathVariable Long projetId) {
        return kpiService.snapshotKpi(projetId);
    }

    @GetMapping("/projets/{projetId}/historique")
    public List<KpiSnapshot> historique(@PathVariable Long projetId) {
        return kpiService.historique(projetId);
    }
}
