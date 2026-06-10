import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { FrontofficeRoutingModule } from './frontoffice-routing.module';
import { LandingComponent } from './landing/landing.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { TasksComponent } from './tasks/tasks.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectDetailComponent } from './projects/project-detail/project-detail.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ProfileComponent } from './profile/profile.component';
import { LayoutComponent } from './layout/layout.component';
import { FormsModule } from '@angular/forms';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { TaskDialogComponent } from '../dialogs/task-dialog.component';
import { MyTeamsComponent } from './my-teams/my-teams.component';

import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [
    LandingComponent,
    NavbarComponent,
    FooterComponent,
    TasksComponent,

    ProjectsComponent,
    ProjectDetailComponent,
    NotificationsComponent,
    ProfileComponent,
    LayoutComponent,
    MyTeamsComponent,
    //TaskDialogComponent
  ],
  imports: [
    CommonModule,           // ← fixes date pipe, ngClass, *ngIf, *ngFor
    RouterModule,           // ← fixes router-outlet
       // ← fixes [formGroup] — must be in imports not declarations
    FrontofficeRoutingModule,
    MatSnackBarModule,
    MatDialogModule,
    NgApexchartsModule,
        FormsModule,

  ]
})
export class FrontofficeModule { }
