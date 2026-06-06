// Domain model for the ms-projet microservice (Gestion des projets + KPI).
// Field names match the backend DTOs exactly (ProjetDto, PhaseDto, KpiDto).

export type ProjetStatut =
  | 'PLANIFIE'
  | 'EN_COURS'
  | 'TERMINE'
  | 'EN_RETARD'
  | 'ANNULE';

export type Priorite = 'BASSE' | 'MOYENNE' | 'HAUTE' | 'CRITIQUE';

export interface Projet {
  id: number;
  nom: string;
  description?: string;
  dateDebut: string;          // yyyy-MM-dd
  dateFinPrevue: string;      // yyyy-MM-dd
  dateFinReelle?: string | null;
  statut: ProjetStatut;
  priorite: Priorite;
  budget?: number | null;
  chefProjetId?: number | null;
}

// Payload sent on create/update (id is optional / ignored by the backend).
export interface ProjetDTO {
  nom: string;
  description?: string;
  dateDebut: string;
  dateFinPrevue: string;
  dateFinReelle?: string | null;
  statut?: ProjetStatut;
  priorite?: Priorite;
  budget?: number | null;
  chefProjetId?: number | null;
}

export interface Phase {
  id: number;
  nom: string;
  ordre?: number | null;
  dateDebut?: string | null;
  dateFin?: string | null;
  pourcentageAvancement?: number | null;
  projetId?: number;
}

export interface PhaseDTO {
  nom: string;
  ordre?: number | null;
  dateDebut?: string | null;
  dateFin?: string | null;
  pourcentageAvancement?: number | null;
}

// Real-time KPI (GET /api/kpi/projets/{id}) — not persisted.
export interface Kpi {
  projetId: number;
  dateCalcul: string;         // ISO datetime
  tauxAvancement: number;
  delaiMoyenTaches: number;
  nbTachesEnRetard: number;
  nbTachesTotal: number;
  nbTachesTerminees: number;
}

// Persisted KPI snapshot (POST .../snapshot, GET .../historique).
export interface KpiSnapshot extends Kpi {
  id: number;
}

export interface ProjetFilters {
  statut?: ProjetStatut;
  priorite?: Priorite;
  chefId?: number;
}

// ---- UI helpers (Modernize template palette, shared by list + detail) ----

export const STATUT_META: Record<ProjetStatut, { label: string; color: string; bg: string }> = {
  PLANIFIE:  { label: 'Planifié',  color: '#5d87ff', bg: '#eef2ff' },
  EN_COURS:  { label: 'En cours',  color: '#13deb9', bg: '#e6fff9' },
  TERMINE:   { label: 'Terminé',   color: '#539bff', bg: '#e8f7ff' },
  EN_RETARD: { label: 'En retard', color: '#fa5c7c', bg: '#fff0f3' },
  ANNULE:    { label: 'Annulé',    color: '#7c8fac', bg: '#f2f4f8' },
};

export const PRIORITE_META: Record<Priorite, { label: string; color: string; bg: string }> = {
  BASSE:    { label: 'Basse',    color: '#13deb9', bg: '#e6fff9' },
  MOYENNE:  { label: 'Moyenne',  color: '#ffae1f', bg: '#fff8e6' },
  HAUTE:    { label: 'Haute',    color: '#fa896b', bg: '#fbf2ef' },
  CRITIQUE: { label: 'Critique', color: '#fa5c7c', bg: '#fff0f3' },
};

export const PROJET_STATUTS: ProjetStatut[] =
  ['PLANIFIE', 'EN_COURS', 'TERMINE', 'EN_RETARD', 'ANNULE'];

export const PRIORITES: Priorite[] = ['BASSE', 'MOYENNE', 'HAUTE', 'CRITIQUE'];
