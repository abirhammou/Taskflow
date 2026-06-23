import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html'
})
export class AppBadgeComponent implements OnInit {

  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm = '';
  loading = false;
  totalUsers = 0;
  totalRegular = 0;
  totalAdmins = 0;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
  this.loading = true;
  this.auth.getAllUsers().subscribe({
    next: (data) => {
      this.users = data;
      this.filteredUsers = data;
      this.totalUsers = data.length;
      this.totalRegular = data.filter(u => u.role === 'USER').length;
      this.totalAdmins = data.filter(u => u.role === 'ADMIN').length;
      this.loading = false;
    },
    error: () => this.loading = false
  });
}

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm = term;
    this.filteredUsers = this.users.filter(u =>
      u.username.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.role.toLowerCase().includes(term)
    );
  }

}