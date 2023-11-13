import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/shared/interfaces/Project';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {

  user!: User;
  currentProjectId!: any;

  isSubmitted = false;

  form!: UntypedFormGroup;

  constructor(private fb: FormBuilder, private userService: UserService,
    private activatedRoute: ActivatedRoute, private projectService: ProjectService) {
    userService.getUserById(userService.currentUser.id).subscribe((user: User) => {
      this.user = user
    })

    this.activatedRoute.params.subscribe(params => {
      this.currentProjectId = params['id']
    })

    this.form = fb.group({
      title: (''),
      description: (''),
      githubUrl: (''),
      liveUrl: (''),
      visibility: (false),
      techs: fb.array([]),
    })
    
    this.projectService.getProjectById(this.currentProjectId).subscribe((currentProjectData) => {
      this.fillInputs(currentProjectData)
    })

  }

  ngOnInit() {
  }

  get fc() {
    return this.form.controls
  }

  get techs() {
    return this.form.controls["techs"] as FormArray
  }

  fillInputs(project: Project) {
    this.fc.description.setValue(project.description)
    this.fc.title.setValue(project.title)
    this.fc.githubUrl.setValue(project.githubUrl)
    this.fc.liveUrl.setValue(project.liveUrl)
    this.fc.visibility.setValue(project.visibility)

    for(let i = 0; i < project.techs!.length; i++) {
      this.addTech(project.techs![i])
    }
  }

  addTech(value?: string) {
    const techControl = new FormControl(value ? value: '')
    
    return this.techs.push(techControl)
  }

  deleteTech(techIndex: number) {
    return this.techs.removeAt(techIndex)
  }

  onSubmit() {
    this.isSubmitted = true

    const fv = this.form.value

    const GHUrl = this.ensureHttpOrHttps(fv.githubUrl)
    const liveUrl = this.ensureHttpOrHttps(fv.liveUrl)

    const updatedProject = {
      currentUserId: this.user.id,
      projectId: this.currentProjectId,
      title: fv.title,
      description: fv.description,
      githubUrl: GHUrl,
      liveUrl: liveUrl,
      visibility: fv.visibility,
      techs: fv.techs
    }

    this.projectService.updateProject(updatedProject).subscribe()
  }

  ensureHttpOrHttps(input: string | undefined): string | undefined {
    if (input) {
      if (input.startsWith('http://') || input.startsWith('https://')) {
        return input;
      } else {
        return 'http://' + input
      }
    } else {
      return input
    }

  }

}
