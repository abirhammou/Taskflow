import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./frontoffice/frontoffice.module').then(m => m.FrontofficeModule)
  },
  {
    path: 'authentication',
    loadChildren: () =>
      import('./dashboard/pages/authentication/authentication.module').then(
        m => m.AuthenticationModule
      )
  },
  {
    path: 'dashboard',
    canActivate: [AdminGuard],
    loadChildren: () =>
      import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }