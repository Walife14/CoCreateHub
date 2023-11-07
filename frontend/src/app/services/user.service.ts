import { Injectable } from '@angular/core';
import { User } from '../shared/models/User';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { IUserRegister } from '../shared/interfaces/IUserRegister';
import { HttpClient, HttpParams } from '@angular/common/http'
import { USER_BY_ID_URL, USER_LOGIN_URL, USER_REGISTER_URL, USER_UPDATE_URL } from '../shared/constants/urls';

const USER_KEY = 'User'
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage())
  public userObservable: Observable<User>


  constructor(private http: HttpClient) {
    this.userObservable = this.userSubject.asObservable()
  }

  public get currentUser(): User {
    return this.userSubject.value
  }

  login(userLogin: IUserLogin):Observable<User> {
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user)
          this.userSubject.next(user)
          console.log(
            `Welcome to CoCreateHub ${user.name}`,
            'Login successful'
          )
        },
        error: (errorResponse) => {
          console.log('Login Failed')
        }
      })
    )
  }

  register(userRegister: IUserRegister): Observable<User> {
    return this.http.post<User>(USER_REGISTER_URL, userRegister).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user)
          this.userSubject.next(user)
          console.log(
            `Welcome to CoCreateHub ${user.name}`,
            'Register successful'
          )
        },
        error: (errorResponse) => {
          console.log('Register Failed')
        }
      })
    )
  }

  logout() {
    this.userSubject.next(new User())
    localStorage.removeItem(USER_KEY)
    window.location.reload()
  }

  private setUserToLocalStorage(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }

  private getUserFromLocalStorage(): User {
    const userJson = localStorage.getItem(USER_KEY)
    if(userJson) return JSON.parse(userJson) as User
    return new User()
  }

  // make an interface for updatedData and put it into the edit-profile component aswell
  update(updatedData: any): Observable<any> {
    return this.http.put<any>(USER_UPDATE_URL, updatedData).pipe(
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
    return this.http.get<User>(USER_BY_ID_URL + id)
  }
}
