import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Projet, ProjetDTO, Phase, PhaseDTO,
  Kpi, KpiSnapshot, ProjetFilters,
} from '../models/projet.model';

// API Gateway address – same as TaskService (the auth interceptor attaches the Keycloak JWT).
const API_GATEWAY = 'http://localhost:8085';

@Injectable({ providedIn: 'root' })
export class ProjetService {
  constructor(private http: HttpClient) {}

  // ---- Projets ----

  getAll(filters: ProjetFilters = {}): Observable<Projet[]> {
    let params = new HttpParams();
    if (filters.statut)   params = params.set('statut', filters.statut);
    if (filters.priorite) params = params.set('priorite', filters.priorite);
    if (filters.chefId != null) params = params.set('chefId', filters.chefId);
    return this.http.get<Projet[]>(`${API_GATEWAY}/api/projets`, { params });
  }

  getById(id: number): Observable<Projet> {
    return this.http.get<Projet>(`${API_GATEWAY}/api/projets/${id}`);
  }

  create(dto: ProjetDTO): Observable<Projet> {
    return this.http.post<Projet>(`${API_GATEWAY}/api/projets`, dto);
  }

  update(id: number, dto: ProjetDTO): Observable<Projet> {
    return this.http.put<Projet>(`${API_GATEWAY}/api/projets/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_GATEWAY}/api/projets/${id}`);
  }

  // ---- Phases ----

  getPhases(projetId: number): Observable<Phase[]> {
    return this.http.get<Phase[]>(`${API_GATEWAY}/api/projets/${projetId}/phases`);
  }

  createPhase(projetId: number, dto: PhaseDTO): Observable<Phase> {
    return this.http.post<Phase>(`${API_GATEWAY}/api/projets/${projetId}/phases`, dto);
  }

  updatePhase(phaseId: number, dto: PhaseDTO): Observable<Phase> {
    return this.http.put<Phase>(`${API_GATEWAY}/api/phases/${phaseId}`, dto);
  }

  deletePhase(phaseId: number): Observable<void> {
    return this.http.delete<void>(`${API_GATEWAY}/api/phases/${phaseId}`);
  }

  // ---- KPI (sujet metier) ----

  getKpi(projetId: number): Observable<Kpi> {
    return this.http.get<Kpi>(`${API_GATEWAY}/api/kpi/projets/${projetId}`);
  }

  createSnapshot(projetId: number): Observable<KpiSnapshot> {
    return this.http.post<KpiSnapshot>(`${API_GATEWAY}/api/kpi/projets/${projetId}/snapshot`, {});
  }

  getHistorique(projetId: number): Observable<KpiSnapshot[]> {
    return this.http.get<KpiSnapshot[]>(`${API_GATEWAY}/api/kpi/projets/${projetId}/historique`);
  }
}
