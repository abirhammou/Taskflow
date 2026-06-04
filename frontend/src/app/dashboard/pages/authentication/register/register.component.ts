import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class AppSideRegisterComponent {
  constructor(private auth: AuthService) {}

  register() {
    this.auth.keycloakRegister(); // redirects to Keycloak register page
  }
}