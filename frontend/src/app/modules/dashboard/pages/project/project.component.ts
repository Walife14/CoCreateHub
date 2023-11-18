import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { UserService } from 'src/app/services/user.service';
import { Project } from 'src/app/shared/interfaces/Project';
import { User } from 'src/app/shared/models/User';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {


  currentProjectId?: string;
  project!: Project;

  showProjectMembers = false;

  user!: User;
  isCreator = false;
  currentUserId: any;

  constructor(private projectService: ProjectService, private activatedRoute: ActivatedRoute,
    private authService: AuthService, private userService: UserService) {

    this.currentProjectId = activatedRoute.snapshot.paramMap.get('id')!
    this.currentUserId = authService.currentUser.id

    forkJoin({
      user: userService.getUserById(this.currentUserId),
      project: projectService.getProjectById(this.currentProjectId)
    }).subscribe((results) => {
      this.project = results.project
      this.user = results.user

      // Check if current user is project creator
      this.isCreator = this.checkIfCurrentUserIsProjectCreator(this.user, this.project.projectCreator)
    })
    
    // userService.userObservable.subscribe((user) => {
    //   userService.getUserById(user.id).subscribe((user: User) => {
    //     this.user = user
    //     console.log(this.user)
    //   })
    // })


    // projectService.getProjectById(this.currentProjectId).subscribe((project: Project) => {
    //   this.project = project
    //   this.isCreator = this.checkIfCurrentUserIsProjectCreator(this.user, project.projectCreator)
    //   console.log(this.isCreator)
    // })

  }

  ngOnInit() {
  }

  checkIfCurrentUserIsProjectCreator(user: User, projectCreator: any): boolean {
    
    if (this.user.id === projectCreator.id) {
      console.log("is project creator")
      return true;
    }
    console.log("is not project creator")
    return false;
  }

}
