import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {
  isLoading = false;
  errorMessage?: string;

  user!: User;

  form!: FormGroup;
  isSubmitted = false;

  constructor(private formBuilder: FormBuilder, private userService: UserService,
    private projectService: ProjectService, private authService: AuthService,
    private router: Router) {
      
    }

  ngOnInit() {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      description: ['', [Validators.required]],
    })

    // could potentially reduce api calls by only fetching user once they click create project
    // and the form is correct - since this currently would always fetch current user from the db
    // if someone comes into this page and leaves it would have made an uneccessary fetch
    this.authService.userObservable.subscribe((user: User) => {
      this.user = user
    })
  }

  get fc() {
    return this.form.controls
  }

  onSubmit() {
    this.isSubmitted = true
    this.errorMessage = ''
    if (this.form.invalid) return;
    this.isLoading = true

    const projectCreator = {
      "id": this.user.id,
      "name": this.user.name,
      "email": this.user.email,
      "isProjectAdmin": true
    }
    const newProject = {
      "title": this.fc.title.value,
      "description": this.fc.description.value,
      "createdAt": Date.now(),
      "projectCreator": projectCreator,
      "members": [projectCreator]
    }

    this.projectService.createProject(newProject).subscribe({
      next: (response) => {
        this.isLoading = false
        this.router.navigate([`/dashboard/projects/project/${response.id}`])
      },
      error: (error) => {
        this.isLoading = false
        this.errorMessage = error
      }
    })
  }

}
