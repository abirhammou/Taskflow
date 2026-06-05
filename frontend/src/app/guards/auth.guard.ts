import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    await this.auth.init(); // ← wait for Keycloak before checking

    if (!this.auth.isLoggedIn()) {
      this.auth.login(); // redirect to Keycloak login
      return false;
    }

    if (this.auth.isAdmin()) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    await this.auth.init(); // ← wait for Keycloak before checking

    if (!this.auth.isLoggedIn()) {
      this.auth.loginAsAdmin(); // redirect to Keycloak login
      return false;
    }

    if (this.auth.isAdmin()) {
      return true;
    }

    this.router.navigate(['/app/tasks']);
    return false;
  }
}