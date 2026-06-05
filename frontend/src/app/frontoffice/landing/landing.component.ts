import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  constructor(private auth: AuthService, private router: Router) {}

  goToApp() {
      console.log('isLoggedIn:', this.auth.isLoggedIn());
      console.log('token:', localStorage.getItem('token'));
      
      if (!this.auth.isLoggedIn()) {
        this.router.navigate(['/authentication/login']);
      } else {
        this.router.navigate(['/app/tasks']);
      }
    }

  goToDashboard() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/authentication/login']);
    } else if (this.auth.isAdmin()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/app/tasks']); // user trying to access dashboard
    }
  }

  features = [
    { icon: '✅', title: 'Task Management', desc: 'Create, assign and track tasks with priorities, due dates and status updates.', color: '#5d87ff' },
    { icon: '👥', title: 'Team Collaboration', desc: 'Work together in real time. Comment, mention teammates and share files.', color: '#13deb9' },
    { icon: '📁', title: 'Project Tracking', desc: 'Organize work into projects with progress tracking and milestone management.', color: '#ffae1f' },
    { icon: '🔔', title: 'Smart Notifications', desc: 'Stay informed with instant alerts for assignments, comments and deadlines.', color: '#fa5c7c' },
    { icon: '📊', title: 'Analytics & Reports', desc: 'Visualize team performance and project health with built-in dashboards.', color: '#7460ee' },
    { icon: '🔒', title: 'Role-Based Access', desc: 'Control who can see and do what with granular permission settings.', color: '#2d3748' },
  ];

  steps = [
    { icon: '🏢', title: 'Create your workspace', desc: 'Set up your team and invite members in under 2 minutes.' },
    { icon: '📋', title: 'Add your projects', desc: 'Organize work into projects and break them down into tasks.' },
    { icon: '🚀', title: 'Track & deliver', desc: 'Monitor progress in real time and ship projects on schedule.' },
  ];
}
