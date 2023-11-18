import { Component } from '@angular/core';
import { User } from '../../models/User';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  user!: User;

  navOpen = false;

  constructor(private authService: AuthService) {
    authService.userObservable.subscribe((newUser) => {
      this.user = newUser
    })
  }

  logout() {
    this.authService.logout()
  }

}
