import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user!: User;

  isProfileUser = true;

  constructor(private userService: UserService) {

    // have to fetch using id because the subscribe for userObservable fetches the token data
    // which would be outdated if the user edits their profile
    userService.userObservable.subscribe((user) => {
      userService.getUserById(user.id).subscribe((user: User) => {
        this.user = user
        console.log(this.user)
      })
    })
  }

  ngOnInit() {
  }

}
