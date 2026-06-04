import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  menuOpen  = false;
  username  = '';
  avatarUrl = '';
  isAdmin   = false;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    const user = this.auth.getUser();
    if (user) {
      this.username  = user['preferred_username'] || '';
      this.isAdmin   = this.auth.isAdmin();
      this.avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.username)}&background=5d87ff&color=fff&rounded=true`;
    }
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  logout()     { this.auth.logout(); }
}