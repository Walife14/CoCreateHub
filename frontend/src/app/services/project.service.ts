import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { PROJECT_CREATE_URL, PROJECT_FETCH_ALL_URL, PROJECT_FETCH_BY_ID } from '../shared/constants/urls';
import { Project } from '../shared/interfaces/Project';
import { IProjectCreate } from '../shared/interfaces/IProjectCreate';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(PROJECT_FETCH_ALL_URL).pipe(
      tap({
        next: (projects) => {
          console.log('We got all the projects!')
        },
        error: (errorResponse) => {
          console.log('Failed to fetch all projects')
        }
      })
    )
  }

  createProject(newProject: IProjectCreate): Observable<IProjectCreate> {
    return this.http.post<IProjectCreate>(PROJECT_CREATE_URL, newProject)
  }

  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(PROJECT_FETCH_BY_ID + id).pipe(
      tap({
        next: (project) => {
          console.log({"message": "Successfully fetched project by id", "response": project})
        },
        error: (errorResponse) => {
          console.log({"Message": "Failed to get project by id", "Error": errorResponse})
        }
      })
    )
  }
}
