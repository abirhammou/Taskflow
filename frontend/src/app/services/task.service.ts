import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskDTO, TaskStats } from '../models/task.model';

// API Gateway address – adjust if your gateway runs on different port/host
const API_GATEWAY = 'http://localhost:8085';

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${API_GATEWAY}/task/getAll`);
  }

  addTask(task: TaskDTO): Observable<Task> {
    return this.http.post<Task>(`${API_GATEWAY}/task/add`, task);
  }

  updateTask(id: number, task: TaskDTO): Observable<Task> {
    return this.http.put<Task>(`${API_GATEWAY}/task/update/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${API_GATEWAY}/task/delete/${id}`);
  }

  getStats(): Observable<TaskStats> {
    return this.http.get<TaskStats>(`${API_GATEWAY}/task/stats`);
  }
}