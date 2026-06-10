


import { Component, OnInit } from '@angular/core';
import { TeamService } from '../../services/team.service';

interface Team {
  id: number;
  name: string;
  description: string;
  department: string;
  managerId: number | null;
  memberCount: number;
  isActive: boolean;
  createdAt: string;
}


@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})



export class TeamsComponent implements OnInit {
  teams: Team[] = [];
  filteredTeams: Team[] = [];
  searchQuery = '';
  showModal = false;
  isEditMode = false;
  selectedTeamId: number | null = null;

 newTeam: { name: string; description: string; department: string; memberCount: number; isActive: boolean; managerId: number | null } = {
    name: '', description: '', department: '',
    memberCount: 0, isActive: true, managerId: null
  };

  colors = ['#5d87ff', '#13deb9', '#ffae1f', '#fa5c7c', '#7460ee', '#2d3748'];
  icons = ['🎨', '⚙️', '🚀', '✏️', '🔍', '📋'];

  constructor(private teamService: TeamService) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    this.teamService.getTeams().subscribe({
      next: (data) => {
        this.teams = data;
        this.filteredTeams = data;
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  search(): void {
    const q = this.searchQuery.toLowerCase();
    this.filteredTeams = this.teams.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.department.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  }

  getColor(i: number): string {
    return this.colors[i % this.colors.length];
  }

  getIcon(i: number): string {
    return this.icons[i % this.icons.length];
  }

  openModal(): void {
    this.isEditMode = false;
    this.selectedTeamId = null;
    this.newTeam = { name: '', description: '', department: '', memberCount: 0, isActive: true, managerId: null };
    this.showModal = true;
  }

  openEditModal(team: Team, i: number): void {
    this.isEditMode = true;
    this.selectedTeamId = team.id;
    this.newTeam = {
      name: team.name,
      description: team.description,
      department: team.department,
      memberCount: team.memberCount,
      isActive: team.isActive,
      managerId: team.managerId
    };
    this.showModal = true;
  }

closeModal(): void {
    this.showModal = false;
    this.newTeam = { name: '', description: '', department: '', memberCount: 0, isActive: true, managerId: null as number | null };
  }

  saveTeam(): void {
    if (!this.newTeam.name || !this.newTeam.department) return;

    if (this.isEditMode && this.selectedTeamId) {
      this.teamService.updateTeam(this.selectedTeamId, this.newTeam).subscribe({
        next: () => { this.loadTeams(); this.closeModal(); },
        error: (err) => console.error('Erreur update:', err)
      });
    } else {
      this.teamService.createTeam(this.newTeam).subscribe({
        next: () => { this.loadTeams(); this.closeModal(); },
        error: (err) => console.error('Erreur création:', err)
      });
    }
  }

  deleteTeam(id: number): void {
    if (!confirm('Are you sure you want to delete this team?')) return;
    this.teamService.deleteTeam(id).subscribe({
      next: () => this.loadTeams(),
      error: (err) => console.error('Erreur delete:', err)
    });
  }
}

