import {
  Component, Output, EventEmitter,
  Input, ViewEncapsulation, OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav       = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed       = new EventEmitter<void>();

  showFiller = false;
  username   = '';
  avatarUrl  = '';

  constructor(public dialog: MatDialog, private auth: AuthService) {}

  ngOnInit() {
    const user = this.auth.getUser();
    if (user) {
      this.username  = user['preferred_username'] || '';
      this.avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.username)}&background=5d87ff&color=fff&rounded=true`;
    }
  }

  logout() {
    this.auth.logout();
  }
}