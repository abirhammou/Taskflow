import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjetService } from '../../services/projet.service';
import {
  Projet, ProjetStatut, STATUT_META, PRIORITE_META,
} from '../../models/projet.model';
import { ProjetDialogComponent } from '../../dialogs/projet-dialog.component';

interface StatTab {
  key: 'TOUS' | ProjetStatut;
  label: string;
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  projets: Projet[] = [];
  filtered: Projet[] = [];
  loading = true;

  searchTerm = '';
  activeTab: StatTab['key'] = 'TOUS';
  tabs: StatTab[] = [
    { key: 'TOUS', label: 'Tous' },
    { key: 'EN_COURS', label: 'En cours' },
    { key: 'PLANIFIE', label: 'Planifiés' },
    { key: 'EN_RETARD', label: 'En retard' },
    { key: 'TERMINE', label: 'Terminés' },
    { key: 'ANNULE', label: 'Annulés' },
  ];

  stats = [
    { label: 'Total', value: 0, color: '#5d87ff' },
    { label: 'En cours', value: 0, color: '#13deb9' },
    { label: 'En retard', value: 0, color: '#fa5c7c' },
    { label: 'Terminés', value: 0, color: '#539bff' },
  ];

  statutMeta = STATUT_META;
  prioriteMeta = PRIORITE_META;

  constructor(
    private projetService: ProjetService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.projetService.getAll().subscribe({
      next: (data) => {
        this.projets = data;
        this.computeStats();
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error('Impossible de charger les projets (gateway/auth ?)');
      },
    });
  }

  computeStats(): void {
    const by = (s: ProjetStatut) => this.projets.filter(p => p.statut === s).length;
    this.stats = [
      { label: 'Total', value: this.projets.length, color: '#5d87ff' },
      { label: 'En cours', value: by('EN_COURS'), color: '#13deb9' },
      { label: 'En retard', value: by('EN_RETARD'), color: '#fa5c7c' },
      { label: 'Terminés', value: by('TERMINE'), color: '#539bff' },
    ];
  }

  applyFilter(): void {
    let list = this.projets;
    if (this.activeTab !== 'TOUS') {
      list = list.filter(p => p.statut === this.activeTab);
    }
    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      list = list.filter(p =>
        p.nom.toLowerCase().includes(term) ||
        (p.description || '').toLowerCase().includes(term));
    }
    this.filtered = list;
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilter();
  }

  selectTab(key: StatTab['key']): void {
    this.activeTab = key;
    this.applyFilter();
  }

  // ---- CRUD ----

  openCreate(): void {
    const ref = this.dialog.open(ProjetDialogComponent, { width: '560px', data: null });
    ref.afterClosed().subscribe(payload => {
      if (!payload) return;
      this.projetService.create(payload).subscribe({
        next: () => { this.load(); this.ok('Projet créé'); },
        error: () => this.error('Création échouée'),
      });
    });
  }

  openEdit(p: Projet, ev?: Event): void {
    ev?.stopPropagation();
    const ref = this.dialog.open(ProjetDialogComponent, { width: '560px', data: { ...p } });
    ref.afterClosed().subscribe(payload => {
      if (!payload) return;
      this.projetService.update(p.id, payload).subscribe({
        next: () => { this.load(); this.ok('Projet mis à jour'); },
        error: () => this.error('Mise à jour échouée'),
      });
    });
  }

  remove(p: Projet, ev?: Event): void {
    ev?.stopPropagation();
    if (!confirm(`Supprimer le projet "${p.nom}" ? (ses phases seront supprimées)`)) return;
    this.projetService.delete(p.id).subscribe({
      next: () => { this.load(); this.ok('Projet supprimé'); },
      error: () => this.error('Suppression échouée'),
    });
  }

  openDetail(p: Projet): void {
    this.router.navigate(['/app/projects', p.id]);
  }

  // ---- helpers ----

  initial(p: Projet): string {
    return (p.nom || '?').charAt(0).toUpperCase();
  }

  /** % du temps planifié écoulé (échéance) — métrique réelle, sans appel supplémentaire. */
  timeline(p: Projet): number {
    const start = new Date(p.dateDebut).getTime();
    const end = new Date(p.dateFinPrevue).getTime();
    if (!end || end <= start) return 100;
    const pct = ((Date.now() - start) / (end - start)) * 100;
    return Math.min(100, Math.max(0, Math.round(pct)));
  }

  echeance(p: Projet): string {
    const end = new Date(p.dateFinPrevue);
    const days = Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (p.statut === 'TERMINE') return 'Terminé';
    if (days < 0) return `En retard de ${Math.abs(days)} j`;
    if (days === 0) return "Échéance aujourd'hui";
    return `${days} j restants`;
  }

  private ok(msg: string): void { this.snack.open(msg, 'OK', { duration: 2500 }); }
  private error(msg: string): void { this.snack.open(msg, 'Fermer', { duration: 4500 }); }
}
