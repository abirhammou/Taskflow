import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { LayoutComponent } from './layout/layout.component';
import { TasksComponent } from './tasks/tasks.component';
import { TeamsComponent } from './teams/teams.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectDetailComponent } from './projects/project-detail/project-detail.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from '../guards/auth.guard';
import { MyTeamsComponent } from './my-teams/my-teams.component';

const routes: Routes = [
  { path: '', component: LandingComponent,},
  {
    path: 'app',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'tasks', pathMatch: 'full' },
      { path: 'tasks', component: TasksComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'projects/:id', component: ProjectDetailComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'my-teams', component: MyTeamsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontofficeRoutingModule { }
