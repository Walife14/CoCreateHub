import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { PROJECT_CREATE_URL, PROJECT_DELETE_URL, PROJECT_FETCH_ALL_URL, PROJECT_FETCH_BY_ID, PROJECT_UPDATE_URL } from '../shared/constants/urls';
import { Project } from '../shared/interfaces/Project';
import { IProjectCreate } from '../shared/interfaces/IProjectCreate';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient, private userService: UserService) { }

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
    return this.http.post<IProjectCreate>(PROJECT_CREATE_URL, newProject).pipe(
      tap({
        next: (project) => {
          // Add the project to the creators/users DB document
          const newProject = {
            id: project.id,
            title: project.title,
            description: project.description
          }

          this.userService.update({id: project.projectCreator.id, newProject: newProject}).subscribe()
        },
        error: (errorResponse) => {
          console.error("Failed:" + errorResponse.error)
        }
      })
    )
  }

  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(PROJECT_FETCH_BY_ID + id)
    .pipe(
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

  updateProject(updateObject: any): Observable<any> {
    return this.http.put<any>(PROJECT_UPDATE_URL, updateObject).pipe(
      tap({
        next: (update) => {
          console.log("successfully updated project", update)
        },
        error: (errorResponse) => {
          "failed to update project"
        }
      })
    )
  }

  deleteProject(id: string) {

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
      body: { id: id}
    }

    return this.http.delete(PROJECT_DELETE_URL, httpOptions).pipe(
      tap({
        next: (success) => {
          console.log(success)
        },
        error: (error) => {
          console.error(error.error)
        }
      })
    )
  }
}
