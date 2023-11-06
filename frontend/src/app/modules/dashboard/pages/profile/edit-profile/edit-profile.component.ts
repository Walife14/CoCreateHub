import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  form!: FormGroup;

  currentUserId?: string;

  isSubmitted = false;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.form = fb.group({
      bio: (''),
      projectGoals: (''),
      websiteUrl: (''),
      linkedinUrl: (''),
      githubUrl: (''),
      techs: fb.array([], Validators.required)
    })

    userService.userObservable.subscribe((user: User) => {
      console.log(user)
      this.currentUserId = user.id
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

  addTech() {
    const techForm = this.fb.group({
      tech: ['']
    })

    this.techs.push(techForm)
  }

  deleteTech(techIndex: number) {
    this.techs.removeAt(techIndex)
  }


  onSubmit() {

    if(!this.currentUserId) return
    this.isSubmitted = true
    
    const fv = this.form.value

    const updatedProfile = {
      id: this.currentUserId,
      bio: fv.bio,
      projectGoals: fv.projectGoals,
      websiteUrl: fv.websiteUrl,
      linkedinUrl: fv.linkedinUrl,
      githubUrl: fv.githubUrl,
      techs: fv.techs
    }

    console.log(updatedProfile)

    this.userService.update(updatedProfile).subscribe((e) => {
      console.log(e)
    })
  }

}
