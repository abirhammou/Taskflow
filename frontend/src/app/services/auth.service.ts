import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private API = 'http://localhost:8085/auth';

  constructor(private http: HttpClient, private router: Router) {}

  register(data: { username: string; email: string; password: string }) {
    return this.http.post<any>(`${this.API}/register`, data).pipe(
      tap(res => this.saveSession(res))
    );
  }

  login(data: { email: string; password: string }) {
    return this.http.post<any>(`${this.API}/login`, data).pipe(
      tap(res => this.saveSession(res))
    );
  }

  private saveSession(res: any) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  getProfile(id: string) {
    return this.http.get<any>(`${this.API}/profile/${id}`);
  }

  updateProfile(id: string, data: { username?: string; email?: string; password?: string }) {
    return this.http.put<any>(`${this.API}/profile/${id}`, data);
  }

  getToken() { return localStorage.getItem('token'); }
  getUser()  { return JSON.parse(localStorage.getItem('user') || 'null'); }
  isLoggedIn(){ return !!this.getToken(); }
  isAdmin()  { return this.getUser()?.role === 'ADMIN'; }
}