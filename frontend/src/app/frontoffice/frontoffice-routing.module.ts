import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { LayoutComponent } from './layout/layout.component';
import { TasksComponent } from './tasks/tasks.component';
import { TeamsComponent } from './teams/teams.component';
import { ProjectsComponent } from './projects/projects.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: 'app',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'tasks', pathMatch: 'full' },
      { path: 'tasks', component: TasksComponent },
      { path: 'teams', component: TeamsComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'profile', component: ProfileComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontofficeRoutingModule { }
