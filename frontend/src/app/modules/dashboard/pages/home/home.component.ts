import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  user!: User;

  showInvitations = false;

  constructor(private userService: UserService) {

    // console.log(userService.currentUser.id)

    userService.getUserById(userService.currentUser.id).subscribe({
      next: (user: User) => {
        this.user = user
        console.log(user)
      },
      error: (error) => {
        console.error(error.response)
      }
    })
    
  }

  ngOnInit() {
  }

}
