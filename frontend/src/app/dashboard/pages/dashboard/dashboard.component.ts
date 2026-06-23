import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { AuthService } from 'src/app/services/auth.service';
import { TaskStats } from 'src/app/models/task.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppDashboardComponent implements OnInit {

  taskStats: TaskStats = {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    completionRate: 0
  };

  totalUsers = 0;
  totalRegular = 0;
  totalAdmins = 0;
  recentUsers: any[] = [];
  loading = true;

  constructor(
    private taskService: TaskService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadTaskStats();
    this.loadUserStats();
  }

  loadTaskStats(): void {
    this.taskService.getStats().subscribe({
      next: (data) => this.taskStats = data,
      error: () => console.warn('Could not load task stats')
    });
  }

  loadUserStats(): void {
    this.auth.getAllUsers().subscribe({
      next: (users) => {
        this.totalUsers = users.length;
        this.totalRegular = users.filter(u => u.role === 'USER').length;
        this.totalAdmins = users.filter(u => u.role === 'ADMIN').length;
        this.recentUsers = users.slice(-5).reverse(); // last 5 registered
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}