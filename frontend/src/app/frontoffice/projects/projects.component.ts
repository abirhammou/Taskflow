import { Component } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {

  projects = [
    { name: 'TaskFlow Web App', icon: '🌐', description: 'Main web application for task and project management.', status: 'active', color: '#5d87ff', progress: 68, completedTasks: 17, totalTasks: 25, team: ['Alice', 'Bob', 'Carol'], due: 'Jul 15' },
    { name: 'Mobile App', icon: '📱', description: 'iOS and Android mobile app for TaskFlow.', status: 'active', color: '#13deb9', progress: 35, completedTasks: 7, totalTasks: 20, team: ['Dave', 'Eve'], due: 'Sep 1' },
    { name: 'API Backend', icon: '⚙️', description: 'RESTful API with authentication and data management.', status: 'active', color: '#ffae1f', progress: 80, completedTasks: 16, totalTasks: 20, team: ['Frank', 'Grace', 'Hank'], due: 'Jun 20' },
    { name: 'Design System', icon: '✏️', description: 'Component library and brand design system.', status: 'completed', color: '#7460ee', progress: 100, completedTasks: 12, totalTasks: 12, team: ['Karen', 'Leo'], due: 'May 10' },
    { name: 'Marketing Site', icon: '📣', description: 'Public landing page and marketing website.', status: 'paused', color: '#fa5c7c', progress: 50, completedTasks: 5, totalTasks: 10, team: ['Mia', 'Noah'], due: 'Aug 5' },
    { name: 'Analytics Dashboard', icon: '📊', description: 'Data visualization and reporting dashboard.', status: 'active', color: '#2d3748', progress: 20, completedTasks: 3, totalTasks: 15, team: ['Olivia', 'Paul', 'Quinn'], due: 'Oct 1' },
  ];
}
