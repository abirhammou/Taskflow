import { Component, OnInit } from '@angular/core';
import { TeamService } from '../../services/team.service';

interface Team {
  id: number;
  name: string;
  description: string;
  department: string;
  memberCount: number;
  isActive: boolean;
}

@Component({
  selector: 'app-my-teams',
  templateUrl: './my-teams.component.html',
  styleUrls: ['./my-teams.component.scss']
})
export class MyTeamsComponent implements OnInit {
  teams: Team[] = [];
  filteredTeams: Team[] = [];
  searchQuery = '';
  isLoading = true;

  colors = ['#5d87ff', '#13deb9', '#ffae1f', '#fa5c7c', '#7460ee', '#2d3748'];
  icons = ['🎨', '⚙️', '🚀', '✏️', '🔍', '📋'];

  constructor(private teamService: TeamService) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    this.isLoading = true;
    this.teamService.getTeams().subscribe({
      next: (data: any[]) => {
        this.teams = data;
        this.filteredTeams = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Erreur:', err);
        this.isLoading = false;
      }
    });
  }

  search(): void {
    const q = this.searchQuery.toLowerCase();
    this.filteredTeams = this.teams.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.department.toLowerCase().includes(q)
    );
  }

  getColor(i: number): string {
    return this.colors[i % this.colors.length];
  }

  getIcon(i: number): string {
    return this.icons[i % this.icons.length];
  }
}