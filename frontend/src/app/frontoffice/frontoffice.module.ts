import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FrontofficeRoutingModule } from './frontoffice-routing.module';
import { LandingComponent } from './landing/landing.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { TasksComponent } from './tasks/tasks.component';
import { TeamsComponent } from './teams/teams.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectDetailComponent } from './projects/project-detail/project-detail.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ProfileComponent } from './profile/profile.component';
import { LayoutComponent } from './layout/layout.component';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [
    LandingComponent,
    NavbarComponent,
    FooterComponent,
    TasksComponent,
    TeamsComponent,
    ProjectsComponent,
    ProjectDetailComponent,
    NotificationsComponent,
    ProfileComponent,
    LayoutComponent,
  ],
  imports: [
    CommonModule,           // ← fixes date pipe, ngClass, *ngIf, *ngFor
    RouterModule,           // ← fixes router-outlet
    FormsModule,
    ReactiveFormsModule,    // ← fixes [formGroup] — must be in imports not declarations
    FrontofficeRoutingModule,
    MatSnackBarModule,
    MatDialogModule,
    NgApexchartsModule,
  ]
})
export class FrontofficeModule { }