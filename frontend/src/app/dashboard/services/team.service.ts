import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamService {
  private apiUrl = 'http://localhost:8085/api/teams';

  constructor(private http: HttpClient) {}

  getTeams(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createTeam(team: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, team);
  }

  updateTeam(id: number, team: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, team);
  }

  deleteTeam(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}