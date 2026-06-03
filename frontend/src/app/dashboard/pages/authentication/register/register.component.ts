import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class AppSideRegisterComponent {

  form = new FormGroup({
    uname:    new FormControl('', [Validators.required, Validators.minLength(3)]),
    email:    new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  get f() { return this.form.controls; }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    this.auth.register({
      username: this.f['uname'].value!,
      email:    this.f['email'].value!,
      password: this.f['password'].value!,
    }).subscribe({
      next: () => this.router.navigate(['/app/tasks']),
      error: err => {
        this.error = err.error?.message || 'Registration failed';
        this.loading = false;
      }
    });
  }
}