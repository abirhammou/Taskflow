import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/authentication/login']);
      return false;
    }

    // Already logged in → redirect based on role
    if (this.auth.isAdmin()) {
      this.router.navigate(['/dashboard']);
    } else {
      return true; // allow access to /app/tasks
    }

    return false;
  }
}

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/authentication/login']);
      return false;
    }
    if (this.auth.isAdmin()) return true;
    this.router.navigate(['/app/tasks']); // logged in but not admin
    return false;
  }
}