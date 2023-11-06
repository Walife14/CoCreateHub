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

  isEditing = false;

  constructor(private userService: UserService) {
    userService.userObservable.subscribe((user: User) => {
      this.user = user
      console.log(this.user)
    })
  }

  ngOnInit() {
  }

  toggleEdit() {
    this.isEditing = !this.isEditing
    console.log("We're editing this bad boy now!")
  }

}
