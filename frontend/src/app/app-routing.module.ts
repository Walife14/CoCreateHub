import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { AuthRoutingModule } from './modules/auth/auth-routing.module';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { authGuard } from './shared/guards/auth.guard';
import { userGuard } from './shared/guards/user.guard';
import { DashboardRoutingModule } from './modules/dashboard/dashboard-routing.module';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () => AuthRoutingModule,
    canActivate: [userGuard]
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    loadChildren: () => DashboardRoutingModule,
    canActivate: [authGuard]
  },
  // Fall back if no route is matched
  { path: '**', redirectTo: '/auth/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
