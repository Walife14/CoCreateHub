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

  constructor(private userService: UserService) {
    userService.userObservable.subscribe((user: User) => {
      this.user = user
      console.log(user)
    })
  }

  ngOnInit() {
  }

}
