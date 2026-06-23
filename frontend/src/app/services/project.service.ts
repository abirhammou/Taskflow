import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, ProjectDTO } from '../models/project.model';

const API_GATEWAY = 'http://localhost:8085';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  constructor(private http: HttpClient) {}

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${API_GATEWAY}/project/getAll`);
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${API_GATEWAY}/project/get/${id}`);
  }

  createProject(project: ProjectDTO): Observable<Project> {
    return this.http.post<Project>(`${API_GATEWAY}/project/add`, project);
  }

  assignTask(projectId: number, taskId: number, taskTitle: string, assignedBy: string): Observable<Project> {
    const params = new HttpParams()
      .set('taskId', taskId)
      .set('taskTitle', taskTitle)
      .set('assignedBy', assignedBy);

    return this.http.post<Project>(`${API_GATEWAY}/project/${projectId}/assign-task`, null, { params });
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${API_GATEWAY}/project/delete/${id}`);
  }
}