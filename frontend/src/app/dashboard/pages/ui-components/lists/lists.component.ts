import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from '../../../../services/task.service';
import { Task, TaskStats } from '../../../../models/task.model';
import { TaskDialogComponent } from '../../../../dialogs/task-dialog.component';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class AppListsComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  searchTerm: string = '';
  stats: TaskStats = {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    completionRate: 0
  };

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    this.loadStats();
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.applyFilter();
      },
      error: () => this.showError('Failed to load tasks')
    });
  }

  loadStats(): void {
    this.taskService.getStats().subscribe({
      next: (data) => this.stats = data,
      error: () => console.warn('Stats not available')
    });
  }

  applyFilter(): void {
    if (!this.searchTerm) {
      this.filteredTasks = this.tasks;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredTasks = this.tasks.filter(task =>
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term)
      );
    }
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;
    this.applyFilter();
  }

  openTaskDialog(task?: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: task ? { ...task } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (task) {
          // Update
          this.taskService.updateTask(task.id, result).subscribe({
            next: () => {
              this.loadTasks();
              this.loadStats();
              this.showSuccess('Task updated');
            },
            error: () => this.showError('Update failed')
          });
        } else {
          // Add
          this.taskService.addTask(result).subscribe({
            next: () => {
              this.loadTasks();
              this.loadStats();
              this.showSuccess('Task added');
            },
            error: () => this.showError('Add failed')
          });
        }
      }
    });
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.loadTasks();
          this.loadStats();
          this.showSuccess('Task deleted');
        },
        error: () => this.showError('Delete failed')
      });
    }
  }

  toggleStatus(task: Task): void {
    const updated = { ...task, completed: !task.completed };
    this.taskService.updateTask(task.id, updated).subscribe({
      next: () => {
        this.loadTasks();
        this.loadStats();
        this.showSuccess(`Task marked as ${updated.completed ? 'completed' : 'pending'}`);
      },
      error: () => this.showError('Status change failed')
    });
  }

  private showSuccess(msg: string): void {
    this.snackBar.open(msg, 'Close', { duration: 3000, panelClass: 'success-snackbar' });
  }

  private showError(msg: string): void {
    this.snackBar.open(msg, 'Close', { duration: 5000, panelClass: 'error-snackbar' });
  }
}