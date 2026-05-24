import { Component } from '@angular/core';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent {

  activeTab = 'All';
  tabs = ['All', 'In Progress', 'Completed', 'Pending'];

  stats = [
    { label: 'Total Tasks', value: 24, color: '#5d87ff' },
    { label: 'In Progress', value: 8, color: '#ffae1f' },
    { label: 'Completed', value: 12, color: '#13deb9' },
    { label: 'Pending', value: 4, color: '#fa5c7c' },
  ];

  tasks = [
    { title: 'Design new landing page', project: 'TaskFlow Web', assignee: 'You', due: 'Jun 1', priority: 'high', status: 'In Progress', done: false },
    { title: 'Fix login API bug', project: 'Backend', assignee: 'You', due: 'May 30', priority: 'high', status: 'In Progress', done: false },
    { title: 'Write unit tests', project: 'Backend', assignee: 'Ali', due: 'Jun 5', priority: 'medium', status: 'Pending', done: false },
    { title: 'Update README docs', project: 'TaskFlow Web', assignee: 'You', due: 'May 28', priority: 'low', status: 'Completed', done: true },
    { title: 'Set up CI/CD pipeline', project: 'DevOps', assignee: 'Sara', due: 'Jun 10', priority: 'medium', status: 'In Progress', done: false },
    { title: 'Create database schema', project: 'Backend', assignee: 'You', due: 'May 25', priority: 'high', status: 'Completed', done: true },
  ];

  filteredTasks() {
    if (this.activeTab === 'All') return this.tasks;
    return this.tasks.filter(t => t.status === this.activeTab);
  }
}
