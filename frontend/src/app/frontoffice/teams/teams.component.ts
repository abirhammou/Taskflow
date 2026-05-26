import { Component } from '@angular/core';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent {

  teams = [
    { name: 'Frontend Team', description: 'Handles all UI/UX and frontend development tasks.', icon: '🎨', color: '#5d87ff', members: ['Alice', 'Bob', 'Carol', 'Dave', 'Eve'], tasks: 14, progress: 72 },
    { name: 'Backend Team', description: 'API development, database design and server management.', icon: '⚙️', color: '#13deb9', members: ['Frank', 'Grace', 'Hank'], tasks: 9, progress: 55 },
    { name: 'DevOps Team', description: 'CI/CD pipelines, cloud infrastructure and deployments.', icon: '🚀', color: '#ffae1f', members: ['Ivy', 'Jack'], tasks: 6, progress: 40 },
    { name: 'Design Team', description: 'Brand identity, wireframes and design systems.', icon: '✏️', color: '#fa5c7c', members: ['Karen', 'Leo', 'Mia', 'Noah'], tasks: 11, progress: 88 },
    { name: 'QA Team', description: 'Testing, bug reporting and quality assurance.', icon: '🔍', color: '#7460ee', members: ['Olivia', 'Paul'], tasks: 8, progress: 60 },
    { name: 'Product Team', description: 'Roadmap planning, feature specs and stakeholder comms.', icon: '📋', color: '#2d3748', members: ['Quinn', 'Rose', 'Sam'], tasks: 5, progress: 30 },
  ];
}
