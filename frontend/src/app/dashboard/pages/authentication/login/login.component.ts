import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class AppSideLoginComponent {

  constructor(private auth: AuthService) {}

  loginUser() {                          // ← matches HTML (click)="loginUser()"
    this.auth.login();
  }

  loginAdmin() {                         // ← matches HTML (click)="loginAdmin()"
    this.auth.loginAsAdmin();
  }
}