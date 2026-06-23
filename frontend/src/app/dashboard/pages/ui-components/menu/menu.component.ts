import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ProjectService } from '../../../../services/project.service'; // ← adjust path to match your folder structure
import { TaskService } from '../../../../services/task.service';       // ← adjust path
import { AuthService } from '../../../../services/auth.service';       // ← adjust path
import { Project } from '../../../../models/project.model';            // ← adjust path
import { TaskWithUser, UserInfo } from '../../../../models/task.model'; // ← adjust path

interface ProjectAdminView {
  project: Project;
  owner: UserInfo | null;
  ownerLabel: string;
  tasks: TaskWithUser[];
  totalTasks: number;
  completedTasks: number;
  progress: number;
  status: 'active' | 'completed' | 'paused';
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class AppMenuComponent implements OnInit {

  projectViews: ProjectAdminView[] = [];
  loading = true;
  error = '';

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadOverview();
  }

  loadOverview(): void {
    this.loading = true;
    this.error = '';

    forkJoin({
      projects: this.projectService.getAllProjects(),
      tasks: this.taskService.getAllTasksWithUsers(),
      users: this.authService.getAllUsers()
    }).subscribe({
      next: ({ projects, tasks, users }) => {
        this.projectViews = projects.map(project => this.toAdminView(project, tasks, users));
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load admin project overview', err);
        this.error = 'Could not load the projects overview. Please try again.';
        this.loading = false;
      }
    });
  }

  private toAdminView(project: Project, allTasks: TaskWithUser[], users: UserInfo[]): ProjectAdminView {
    const tasks = allTasks.filter(t => project.taskIds.includes(t.id));
    const totalTasks = project.taskIds.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    let status: ProjectAdminView['status'] = 'active';
    if (totalTasks === 0) {
      status = 'paused';
    } else if (completedTasks === totalTasks) {
      status = 'completed';
    }

    // ownerId is stored as the Keycloak username (see ProjectsComponent.openNewProjectModal)
    const owner = users.find(u => u.username === project.ownerId) || null;

    return {
      project,
      owner,
      ownerLabel: owner ? owner.username : (project.ownerId || 'Unknown'),
      tasks,
      totalTasks,
      completedTasks,
      progress,
      status
    };
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}