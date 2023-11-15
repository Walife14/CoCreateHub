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
  filteredIsAdminProjects: any;

  // is the current user the viewer of the user profile
  isProfileUser = false;

  id!: string;

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute) {

    // // get user based on id in route
    this.id = activatedRoute.snapshot.paramMap.get('id')!

    forkJoin({
      fetchedUser: userService.getUserById(this.id),
      currentUser: userService.getUserById(userService.currentUser.id)
    }).subscribe((results) => {
      this.user = results.fetchedUser
      this.currentUser = results.currentUser

      this.filteredIsAdminProjects = this.currentUser.projects.filter(project => project.isProjectAdmin)

      if (this.user && this.currentUser) {
        this.user.id === this.currentUser.id ? this.isProfileUser = true : this.isProfileUser = false
      }
    })

  }

  ngOnInit() {
  }

  onInviteUser(project: any) {

    const invitation = {
      inviteeId: this.user!.id,
      user: {
        id: this.currentUser.id,
        name: this.currentUser.name
      },
      project: {
        id: project.id,
        title: project.title,
        description: project.description
      }
    }

    this.userService.inviteToProject(invitation).subscribe()
  }

}
