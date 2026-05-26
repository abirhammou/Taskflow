import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from '../../services/task.service';
import { Task, TaskStats } from '../../models/task.model';
import { TaskDialogComponent } from '../../dialogs/task-dialog.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasksList: Task[] = [];
  activeTab = 'All';
  tabs = ['All', 'In Progress', 'Completed', 'Pending'];
  searchTerm = '';

  stats = [
    { label: 'Total Tasks', value: 0, color: '#5d87ff' },
    { label: 'In Progress', value: 0, color: '#ffae1f' },
    { label: 'Completed', value: 0, color: '#13deb9' },
    { label: 'Pending', value: 0, color: '#fa5c7c' },
  ];

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.updateStats();
        this.applyFilter();
      },
      error: () => this.showError('Failed to load tasks')
    });
  }

  updateStats(): void {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const pending = this.tasks.filter(t => !t.completed).length;
    // "In Progress" can be the same as pending, or you can define a separate field later
    const inProgress = pending;
    this.stats = [
      { label: 'Total Tasks', value: total, color: '#5d87ff' },
      { label: 'In Progress', value: inProgress, color: '#ffae1f' },
      { label: 'Completed', value: completed, color: '#13deb9' },
      { label: 'Pending', value: pending, color: '#fa5c7c' },
    ];
  }

  applyFilter(): void {
    let filtered = this.tasks;
    // Filter by tab
    if (this.activeTab === 'Completed') {
      filtered = filtered.filter(t => t.completed);
    } else if (this.activeTab === 'Pending') {
      filtered = filtered.filter(t => !t.completed);
    } else if (this.activeTab === 'In Progress') {
      filtered = filtered.filter(t => !t.completed); // same as pending for now
    }
    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term)
      );
    }
    this.filteredTasksList = filtered;
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
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
          this.taskService.updateTask(task.id, result).subscribe({
            next: () => {
              this.loadTasks();
              this.showSuccess('Task updated');
            },
            error: () => this.showError('Update failed')
          });
        } else {
          this.taskService.addTask(result).subscribe({
            next: () => {
              this.loadTasks();
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
          this.showSuccess('Task deleted');
        },
        error: () => this.showError('Delete failed')
      });
    }
  }

  toggleComplete(task: Task): void {
    const updated = { ...task, completed: !task.completed };
    this.taskService.updateTask(task.id, updated).subscribe({
      next: () => {
        this.loadTasks();
        this.showSuccess(`Task marked as ${updated.completed ? 'completed' : 'pending'}`);
      },
      error: () => this.showError('Status change failed')
    });
  }

  private showSuccess(msg: string): void {
    this.snackBar.open(msg, 'Close', { duration: 3000 });
  }

  private showError(msg: string): void {
    this.snackBar.open(msg, 'Close', { duration: 5000 });
  }
}