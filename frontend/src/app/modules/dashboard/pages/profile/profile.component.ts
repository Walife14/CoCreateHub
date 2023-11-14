import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user?: User;

  currentUser!: User;

  // is the current user the viewer of the user profile
  isProfileUser = false;

  id!: string;

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute) {

    // have to fetch using id because the subscribe for userObservable fetches the token data
    // which would be outdated if the user edits their profile
    // userService.userObservable.subscribe((user) => {
    //   userService.getUserById(user.id).subscribe((user: User) => {
    //     this.user = user
    //     console.log(this.user)
    //   })
    // })

    // // get user based on id in route
    this.id = activatedRoute.snapshot.paramMap.get('id')!
    // userService.getUserById(this.id).subscribe((user: User) => {
    //   this.user = user
    //   console.log({"fetched user": this.user.id})
    // })
    
    // // get user currently signed in
    // this.userService.getUserById(this.userService.currentUser.id).subscribe((user: User) => {
    //   this.currentUser = user
    //   console.log({"Current user": this.currentUser.id})
    // })

    forkJoin({
      fetchedUser: userService.getUserById(this.id),
      currentUser: userService.getUserById(userService.currentUser.id)
    }).subscribe((results) => {
      this.user = results.fetchedUser
      this.currentUser = results.currentUser
      if (this.user && this.currentUser) {
        this.user.id === this.currentUser.id ? this.isProfileUser = true : this.isProfileUser = false
      }
    })

  }

  ngOnInit() {
  }

}
