import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: any = null;
  loading = false;
  saving  = false;
  success = '';
  error   = '';

  form = new FormGroup({
    username:        new FormControl('', [Validators.required, Validators.minLength(3)]),
    email:           new FormControl('', [Validators.required, Validators.email]),
    password:        new FormControl(''),
    confirmPassword: new FormControl(''),
  }, { validators: this.passwordMatchValidator });

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.loading = true;
    const currentUser = this.auth.getUser();
    this.auth.getProfile(currentUser.id).subscribe({
      next: (user) => {
        this.user = user;
        this.form.patchValue({ username: user.username, email: user.email });
        this.loading = false;
      },
      error: () => {
        this.error   = 'Failed to load profile';
        this.loading = false;
      }
    });
  }

  get f() { return this.form.controls; }

  passwordMatchValidator(g: any) {
    const pw  = g.get('password').value;
    const cpw = g.get('confirmPassword').value;
    if (!pw) return null;
    return pw === cpw ? null : { mismatch: true };
  }

  getInitials(): string {
    if (!this.user?.username) return '?';
    return this.user.username.split(' ')
      .map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  submit() {
    if (this.form.invalid) return;
    this.saving  = true;
    this.success = '';
    this.error   = '';

    const payload: any = {
      username: this.f['username'].value,
      email:    this.f['email'].value,
    };
    if (this.f['password'].value) {
      payload.password = this.f['password'].value;
    }

    this.auth.updateProfile(this.user._id, payload).subscribe({
      next: (res) => {
        localStorage.setItem('user', JSON.stringify(res.user));
        this.success = 'Profile updated successfully!';
        this.saving  = false;
        this.f['password'].setValue('');
        this.f['confirmPassword'].setValue('');
      },
      error: (err) => {
        this.error  = err.error?.message || 'Update failed';
        this.saving = false;
      }
    });
  }
}