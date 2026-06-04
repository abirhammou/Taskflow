import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Keycloak from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private keycloak: Keycloak;
  private _initPromise: Promise<void> | null = null;
  private NODE_API = 'http://localhost:8085/auth';

  constructor(private http: HttpClient) {
    this.keycloak = new Keycloak({
      url: 'http://localhost:8080',
      realm: 'taskflow',
      clientId: 'taskflow-app'
    });
  }

  init(): Promise<void> {
  if (this._initPromise) return this._initPromise;

  this._initPromise = this.keycloak.init({
    onLoad: 'check-sso',
    checkLoginIframe: false,
    pkceMethod: 'S256'
    // ← removed silentCheckSsoRedirectUri completely
  }).then(() => {
    console.log('Keycloak init done, authenticated:', this.keycloak.authenticated);
  });

  return this._initPromise;
}

  async login() {
    await this.init(); // ← wait for init before redirecting
    this.keycloak.login({ redirectUri: 'http://localhost:4200/app/tasks' });
  }

  async loginAsAdmin() {
    await this.init(); // ← wait for init before redirecting
    this.keycloak.login({ redirectUri: 'http://localhost:4200/dashboard' });
  }

  logout() {
    this.keycloak.logout({ redirectUri: 'http://localhost:4200' });
  }

  isLoggedIn(): boolean {
    return !!this.keycloak.authenticated;
  }

  isAdmin(): boolean {
    return this.keycloak.hasRealmRole('ADMIN');
  }

  isUser(): boolean {
    return this.keycloak.hasRealmRole('USER');
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  getUser() {
    return this.keycloak.tokenParsed;
  }

  getUsername(): string {
    return this.keycloak.tokenParsed?.['preferred_username'] || '';
  }

  async getValidToken(): Promise<string> {
    await this.keycloak.updateToken(30);
    return this.keycloak.token!;
  }

  async keycloakRegister() {
    await this.init();
    this.keycloak.register({ redirectUri: 'http://localhost:4200/app/tasks' });
  }

  getProfile(id: string) {
    return this.http.get<any>(`${this.NODE_API}/profile/${id}`);
  }

  updateProfile(id: string, data: { username?: string; email?: string; password?: string }) {
    return this.http.put<any>(`${this.NODE_API}/profile/${id}`, data);
  }

  getProfileByEmail(email: string) {
    return this.http.get<any>(`${this.NODE_API}/profile/email/${email}`);
  }
}
