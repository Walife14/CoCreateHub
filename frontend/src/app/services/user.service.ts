import { Injectable } from '@angular/core';
import { User } from '../shared/models/User';
import { Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { USER_BY_ID_URL, USER_HANDLE_INVITE, USER_PROJECT_INVITE, USER_UPDATE_URL, USER_VISIBLE_TRUE_URL } from '../shared/constants/urls';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  get httpOptions() {
    const httpOptions = {
      headers: new HttpHeaders({
        'x-auth-token': this.authService.currentUser.token || ''
      })
    }
    return httpOptions
  }

  // make an interface for updatedData and put it into the edit-profile component aswell
  update(updatedData: any): Observable<any> {
    return this.http.put<any>(USER_UPDATE_URL, updatedData, this.httpOptions).pipe(
      tap({
        next: (update) => {
          console.log("successfully updated user", update)
        },
        error: (errorResponse) => {
          "failed to update user"
        }
      })
    )
  }
  
  getUserById(id: string): Observable<any> {
    return this.http.get<User>(USER_BY_ID_URL + id, this.httpOptions)
  }

  getVisibleUsers(): Observable<User[]> {
    return this.http.get<User[]>(USER_VISIBLE_TRUE_URL).pipe(
      tap({
        next: (success) => {
          console.log("Successfully fetched users", success)
        },
        error: (error) => {
          console.error("Failed to get users with visibility set to true", error)
        }
      })
    )
  }

  inviteToProject(data: any): Observable<any> {
    return this.http.put<any>(USER_PROJECT_INVITE, data, this.httpOptions).pipe(
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

  handleProjectInvitation(invitationObj: any): Observable<any> {
    return this.http.post<any>(USER_HANDLE_INVITE, invitationObj, this.httpOptions).pipe(
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
