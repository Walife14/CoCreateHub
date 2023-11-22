import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-find-cocreate-buddy',
  templateUrl: './find-cocreate-buddy.component.html',
  styleUrls: ['./find-cocreate-buddy.component.css']
})
export class FindCocreateBuddyComponent implements OnInit {

  users!: User[];

  constructor(private userService: UserService) {
    userService.getVisibleUsers().subscribe((users: User[]) => {
      this.users = users
    })
  }

  ngOnInit() {
  }

}
