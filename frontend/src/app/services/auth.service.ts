import { Injectable } from '@angular/core';
import { Observable, tap, BehaviorSubject } from 'rxjs'
import { AUTH_LOGIN_URL, AUTH_REGISTER_URL } from '../shared/constants/urls';
import { User } from '../shared/models/User';
import { IUserRegister } from '../shared/interfaces/IUserRegister';
import { HttpClient } from '@angular/common/http';
import { IUserLogin } from '../shared/interfaces/IUserLogin';

const USER_KEY = 'User'
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage())
  public userObservable: Observable<User>

  constructor(private http: HttpClient) {
    this.userObservable = this.userSubject.asObservable()
  }

  public get currentUser(): User {
    return this.userSubject.value
  }

  private setUserToLocalStorage(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }

  private getUserFromLocalStorage(): User {
    const userJson = localStorage.getItem(USER_KEY)
    if(userJson) return JSON.parse(userJson) as User
    return new User()
  }

  login(userLogin: IUserLogin):Observable<User> {
    return this.http.post<User>(AUTH_LOGIN_URL, userLogin).pipe(
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
    return this.http.post<User>(AUTH_REGISTER_URL, userRegister).pipe(
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
    localStorage.removeItem('User')
    window.location.reload()
  }

}
