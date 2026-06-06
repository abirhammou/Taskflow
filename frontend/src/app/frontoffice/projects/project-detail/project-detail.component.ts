import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjetService } from '../../../services/projet.service';
import {
  Projet, Phase, Kpi, KpiSnapshot, STATUT_META, PRIORITE_META,
} from '../../../models/projet.model';
import { ProjetDialogComponent } from '../../../dialogs/projet-dialog.component';
import { PhaseDialogComponent } from '../../../dialogs/phase-dialog.component';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
})
export class ProjectDetailComponent implements OnInit {
  projetId!: number;
  projet?: Projet;
  phases: Phase[] = [];
  kpi?: Kpi;
  historique: KpiSnapshot[] = [];

  loading = true;
  snapshotting = false;

  statutMeta = STATUT_META;
  prioriteMeta = PRIORITE_META;

  // ApexCharts option holders (typed loosely to stay robust across ng-apexcharts versions)
  radialOptions: any;
  barOptions: any;
  historyOptions: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projetService: ProjetService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.projetId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAll();
  }

  loadAll(): void {
    this.loading = true;
    this.projetService.getById(this.projetId).subscribe({
      next: (p) => { this.projet = p; this.loading = false; },
      error: () => { this.loading = false; this.error('Projet introuvable'); },
    });
    this.loadPhases();
    this.loadKpi();
    this.loadHistorique();
  }

  loadPhases(): void {
    this.projetService.getPhases(this.projetId).subscribe({
      next: (data) => this.phases = data.sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0)),
      error: () => {},
    });
  }

  loadKpi(): void {
    this.projetService.getKpi(this.projetId).subscribe({
      next: (k) => { this.kpi = k; this.buildKpiCharts(k); },
      error: () => {},
    });
  }

  loadHistorique(): void {
    this.projetService.getHistorique(this.projetId).subscribe({
      next: (h) => { this.historique = h; this.buildHistoryChart(h); },
      error: () => {},
    });
  }

  // ---- KPI ----

  snapshot(): void {
    this.snapshotting = true;
    this.projetService.createSnapshot(this.projetId).subscribe({
      next: () => {
        this.snapshotting = false;
        this.ok('Snapshot KPI enregistré');
        this.loadKpi();
        this.loadHistorique();
      },
      error: () => { this.snapshotting = false; this.error('Snapshot échoué'); },
    });
  }

  private buildKpiCharts(k: Kpi): void {
    const taux = Math.round(k.tauxAvancement || 0);
    this.radialOptions = {
      series: [taux],
      chart: { type: 'radialBar', height: 280, sparkline: { enabled: false } },
      plotOptions: {
        radialBar: {
          hollow: { size: '60%' },
          track: { background: '#eef2ff' },
          dataLabels: {
            name: { offsetY: 24, color: '#718096', fontSize: '14px' },
            value: { offsetY: -10, fontSize: '30px', fontWeight: 700, color: '#2d3748',
                     formatter: (v: number) => `${v}%` },
          },
        },
      },
      labels: ['Avancement'],
      colors: ['#5d87ff'],
      fill: {
        type: 'gradient',
        gradient: { shade: 'light', type: 'horizontal', gradientToColors: ['#13deb9'], stops: [0, 100] },
      },
      stroke: { lineCap: 'round' },
    };

    this.barOptions = {
      series: [{ name: 'Tâches', data: [k.nbTachesTotal || 0, k.nbTachesTerminees || 0, k.nbTachesEnRetard || 0] }],
      chart: { type: 'bar', height: 280, toolbar: { show: false }, fontFamily: 'inherit' },
      plotOptions: { bar: { borderRadius: 6, distributed: true, columnWidth: '45%' } },
      colors: ['#5d87ff', '#13deb9', '#fa5c7c'],
      dataLabels: { enabled: true },
      legend: { show: false },
      grid: { borderColor: '#f1f3f9' },
      xaxis: { categories: ['Total', 'Terminées', 'En retard'], labels: { style: { colors: '#718096' } } },
      yaxis: { labels: { style: { colors: '#718096' } } },
    };
  }

  private buildHistoryChart(h: KpiSnapshot[]): void {
    const ordered = [...h].reverse(); // backend returns most-recent-first
    this.historyOptions = {
      series: [{ name: 'Avancement %', data: ordered.map(s => Math.round(s.tauxAvancement || 0)) }],
      chart: { type: 'area', height: 280, toolbar: { show: false }, fontFamily: 'inherit' },
      colors: ['#5d87ff'],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } },
      grid: { borderColor: '#f1f3f9' },
      xaxis: {
        categories: ordered.map(s => this.shortDate(s.dateCalcul)),
        labels: { style: { colors: '#718096' } },
      },
      yaxis: { max: 100, min: 0, labels: { style: { colors: '#718096' } } },
    };
  }

  // ---- Projet / phases edition ----

  editProjet(): void {
    if (!this.projet) return;
    const ref = this.dialog.open(ProjetDialogComponent, { width: '560px', data: { ...this.projet } });
    ref.afterClosed().subscribe(payload => {
      if (!payload) return;
      this.projetService.update(this.projetId, payload).subscribe({
        next: (p) => { this.projet = p; this.ok('Projet mis à jour'); },
        error: () => this.error('Mise à jour échouée'),
      });
    });
  }

  addPhase(): void {
    const ref = this.dialog.open(PhaseDialogComponent, { width: '500px', data: null });
    ref.afterClosed().subscribe(payload => {
      if (!payload) return;
      this.projetService.createPhase(this.projetId, payload).subscribe({
        next: () => { this.loadPhases(); this.ok('Phase ajoutée'); },
        error: () => this.error('Ajout de phase échoué'),
      });
    });
  }

  editPhase(ph: Phase): void {
    const ref = this.dialog.open(PhaseDialogComponent, { width: '500px', data: { ...ph } });
    ref.afterClosed().subscribe(payload => {
      if (!payload) return;
      this.projetService.updatePhase(ph.id, payload).subscribe({
        next: () => { this.loadPhases(); this.ok('Phase mise à jour'); },
        error: () => this.error('Mise à jour de phase échouée'),
      });
    });
  }

  removePhase(ph: Phase): void {
    if (!confirm(`Supprimer la phase "${ph.nom}" ?`)) return;
    this.projetService.deletePhase(ph.id).subscribe({
      next: () => { this.loadPhases(); this.ok('Phase supprimée'); },
      error: () => this.error('Suppression de phase échouée'),
    });
  }

  back(): void { this.router.navigate(['/app/projects']); }

  // ---- helpers ----

  phaseColor(pct?: number | null): string {
    const v = pct ?? 0;
    if (v >= 100) return '#13deb9';
    if (v >= 50) return '#5d87ff';
    if (v > 0) return '#ffae1f';
    return '#7c8fac';
  }

  private shortDate(iso: string): string {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  private ok(msg: string): void { this.snack.open(msg, 'OK', { duration: 2500 }); }
  private error(msg: string): void { this.snack.open(msg, 'Fermer', { duration: 4500 }); }
}
