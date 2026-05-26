import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontofficeRoutingModule } from './frontoffice-routing.module';
import { LandingComponent } from './landing/landing.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { TasksComponent } from './tasks/tasks.component';
import { TeamsComponent } from './teams/teams.component';
import { ProjectsComponent } from './projects/projects.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ProfileComponent } from './profile/profile.component';
import { LayoutComponent } from './layout/layout.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LandingComponent,
    NavbarComponent,
    FooterComponent,
    TasksComponent,
    TeamsComponent,
    ProjectsComponent,
    NotificationsComponent,
    ProfileComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    FrontofficeRoutingModule,
    FormsModule,
  ]
})
export class FrontofficeModule { }
