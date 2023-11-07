import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  form!: FormGroup;

  currentUser?: any;
  currentUserId?: string;

  isSubmitted = false;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.form = fb.group({
      bio: (''),
      projectGoals: (''),
      websiteUrl: (''),
      linkedinUrl: (''),
      githubUrl: (''),
      techs: fb.array([], Validators.required)
    })

    this.currentUserId = JSON.parse(localStorage.getItem('User') ?? '{}').id

    if (this.currentUserId) {
      userService.getUserById(this.currentUserId).subscribe((user: User) => {
        this.fillInputs(user)
      })
    }

  }

  ngOnInit() {
  }

  get fc() {
    return this.form.controls
  }

  get techs() {
    return this.form.controls["techs"] as FormArray
  }

  fillInputs(user: User) {
      this.currentUser = user
      this.fc.bio.setValue(user.bio)
      this.fc.projectGoals.setValue(user.projectGoals)
      this.fc.websiteUrl.setValue(user.websiteUrl)
      this.fc.linkedinUrl.setValue(user.linkedinUrl)
      this.fc.githubUrl.setValue(user.githubUrl)

      for(let i = 0; i < user.techs!.length; i++) {
        this.addTech(user.techs![i])
      }
  }

  addTech(value?: string) {
    const techControl = new FormControl(value ? value : '')

    this.techs.push(techControl)
  }

  deleteTech(techIndex: number) {
    this.techs.removeAt(techIndex)
  }


  onSubmit() {
    if (!this.currentUser) return

    this.isSubmitted = true
    
    const fv = this.form.value

    const updatedProfile = {
      id: this.currentUser.id,
      bio: fv.bio,
      projectGoals: fv.projectGoals,
      websiteUrl: fv.websiteUrl,
      linkedinUrl: fv.linkedinUrl,
      githubUrl: fv.githubUrl,
      techs: fv.techs
    }

    this.userService.update(updatedProfile).subscribe(
      (response) => {
        console.log(response)
        setTimeout(() => {
          this.router.navigate(['/dashboard/profile/' + this.currentUserId])
        }, 1000)
      },
      (error) => {
        console.error(error)
      }
    )
  }

}