import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProjectComponent } from './pages/project/project.component';
import { CreateProjectComponent } from './pages/create-project/create-project.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileComponent } from './pages/profile/profile.component';
import { EditProfileComponent } from './pages/profile/edit-profile/edit-profile.component';


@NgModule({
  declarations: [
    HomeComponent,
    ProjectsComponent,
    ProjectComponent,
    CreateProjectComponent,
    ProfileComponent,
    EditProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
