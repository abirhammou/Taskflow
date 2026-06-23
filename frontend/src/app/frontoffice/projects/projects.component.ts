import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Project, ProjectDTO, ProjectView } from '../../models/project.model';
import { Task } from '../../models/task.model';

const ICONS = ['🌐', '📱', '⚙️', '✏️', '📣', '📊', '🚀', '🔧'];
const COLORS = ['#5d87ff', '#13deb9', '#ffae1f', '#7460ee', '#fa5c7c', '#2d3748'];

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projects: ProjectView[] = [];
  allTasks: Task[] = [];
  loading = true;
  error = '';

  // New Project modal state
  showNewProjectModal = false;
  newProject: ProjectDTO = this.emptyProjectDTO();
  creating = false;
  createError = '';

  // Assign Task modal state
  showAssignModal = false;
  selectedProject: ProjectView | null = null;
  availableTasks: Task[] = [];
  selectedTaskId: number | null = null;
  assigning = false;
  assignError = '';

  // Detail side panel state
  showDetailPanel = false;
  detailProject: ProjectView | null = null;
  detailTasks: Task[] = [];

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.error = '';

    forkJoin({
      projects: this.projectService.getAllProjects(),
      tasks: this.taskService.getAllTasks()
    }).subscribe({
      next: ({ projects, tasks }) => {
        this.allTasks = tasks;
        this.projects = projects.map((p, i) => this.toProjectView(p, tasks, i));
        this.loading = false;
        this.refreshDetailPanelIfOpen();
      },
      error: (err) => {
        console.error('Failed to load projects', err);
        this.error = 'Could not load projects. Please try again.';
        this.loading = false;
      }
    });
  }

  // keeps the open side panel in sync after create/assign actions trigger a reload
  private refreshDetailPanelIfOpen(): void {
    if (!this.detailProject) {
      return;
    }
    const updated = this.projects.find(p => p.id === this.detailProject!.id);
    if (updated) {
      this.detailProject = updated;
      this.detailTasks = this.allTasks.filter(t => updated.taskIds.includes(t.id));
    } else {
      // project no longer exists (e.g. deleted)
      this.closeDetailPanel();
    }
  }

  private toProjectView(project: Project, allTasks: Task[], index: number): ProjectView {
    const projectTasks = allTasks.filter(t => project.taskIds.includes(t.id));
    const totalTasks = project.taskIds.length;
    const completedTasks = projectTasks.filter(t => t.completed).length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    let status: ProjectView['status'] = 'active';
    if (totalTasks === 0) {
      status = 'paused';
    } else if (completedTasks === totalTasks) {
      status = 'completed';
    }

    return {
      ...project,
      icon: ICONS[index % ICONS.length],
      color: COLORS[index % COLORS.length],
      status,
      progress,
      completedTasks,
      totalTasks,
      due: project.endDate ? this.formatDate(project.endDate) : 'No due date'
    };
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // ---------- New Project ----------

  private emptyProjectDTO(): ProjectDTO {
    return { name: '', description: '', startDate: '', endDate: '', ownerId: '' };
  }

  openNewProjectModal(): void {
    this.newProject = this.emptyProjectDTO();
    this.newProject.ownerId = this.authService.getUsername();
    this.createError = '';
    this.showNewProjectModal = true;
  }

  closeNewProjectModal(): void {
    this.showNewProjectModal = false;
  }

  submitNewProject(): void {
    if (!this.newProject.name.trim() || !this.newProject.startDate) {
      this.createError = 'Name and start date are required.';
      return;
    }

    this.creating = true;
    this.createError = '';

    this.projectService.createProject(this.newProject).subscribe({
      next: () => {
        this.creating = false;
        this.showNewProjectModal = false;
        this.loadProjects();
      },
      error: (err) => {
        console.error('Failed to create project', err);
        this.creating = false;
        this.createError = 'Could not create the project. Please try again.';
      }
    });
  }

  // ---------- Assign Task ----------

  openAssignModal(project: ProjectView, event?: Event): void {
    event?.stopPropagation();
    this.selectedProject = project;
    this.availableTasks = this.allTasks.filter(t => !project.taskIds.includes(t.id));
    this.selectedTaskId = null;
    this.assignError = '';
    this.showAssignModal = true;
  }

  closeAssignModal(): void {
    this.showAssignModal = false;
    this.selectedProject = null;
  }

  submitAssign(): void {
    if (!this.selectedProject || !this.selectedTaskId) {
      return;
    }

    const task = this.availableTasks.find(t => t.id === this.selectedTaskId);
    if (!task) {
      return;
    }

    this.assigning = true;
    this.assignError = '';

    this.projectService.assignTask(
      this.selectedProject.id,
      task.id,
      task.title,
      this.authService.getUsername()
    ).subscribe({
      next: () => {
        this.assigning = false;
        this.showAssignModal = false;
        this.selectedProject = null;
        this.loadProjects();
      },
      error: (err) => {
        console.error('Failed to assign task', err);
        this.assigning = false;
        this.assignError = 'Could not assign the task. Please try again.';
      }
    });
  }

  // ---------- Detail Panel ----------

  openDetailPanel(project: ProjectView): void {
    this.detailProject = project;
    this.detailTasks = this.allTasks.filter(t => project.taskIds.includes(t.id));
    this.showDetailPanel = true;
  }

  closeDetailPanel(): void {
    this.showDetailPanel = false;
    this.detailProject = null;
    this.detailTasks = [];
  }
}