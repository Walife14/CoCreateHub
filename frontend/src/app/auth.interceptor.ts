import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpEventType,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    const token = this.authService.currentUser.token;

    if (token) {
      const modifiedRequest = req.clone({
        headers: req.headers.append("x-auth-token", `${token}`)
        // headers: req.headers.append("Authorization", `x-auth-token ${token}`)
      })

      return next.handle(modifiedRequest).pipe(
        tap({
          next: (event) => {
            if (event instanceof HttpResponse) {
              // if the request is unauthorized then remove token
              if (event.status === 401) {
                localStorage.removeItem('User')
              }
            }
            return event
          },
          error: (error) => {
            // if the request is unauthorized then remove token
            if (error.status === 401) {
              console.log("Clearing token")
              this.authService.logout()
            }
          }
        })
      )
    } else {
      return next.handle(req)
    }


    // WORKS
    // const modifiedRequest = req.clone({
    //   headers: req.headers.append("x-auth-token", `${token}`)
    // })

    // return next.handle(modifiedRequest)
    //   .pipe(tap({
    //     next: (response) => {
    //       // successful request (aka valid token)
    //     },
    //     error: (error) => {
    //       if(error.error.message === 'Token invalid') {
    //         // if the token they have at the moment is invalid then remove the token from their localStorage
    //         return localStorage.removeItem('User')
    //       }
    //     }
    //   }))

  }
}
