import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';
import { visibilityValidator } from 'src/app/shared/validators/visibility_validator';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  isLoading = false;

  form!: FormGroup;

  currentUser?: any;
  currentUserId?: string;

  isSubmitted = false;

  incorrectFields = false;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, private authService: AuthService) {
    this.form = fb.group({
      bio: (''),
      projectGoals: (''),
      websiteUrl: (''),
      linkedinUrl: (''),
      githubUrl: (''),
      visibility: (false),
      techs: fb.array([])
    })

    if (authService.currentUser.id) {
      userService.getUserById(authService.currentUser.id).subscribe((user: User) => {
        this.currentUser = user
        console.log(user)
        this.fillInputs(user)
      })
    }

    const visibilityControl = this.form.get('visibility')!
    visibilityControl.valueChanges.subscribe(() => {
      if (visibilityControl.value === true) {
        this.form.setValidators(visibilityValidator('visibility', 'bio', 'projectGoals', 'linkedinUrl', 'githubUrl'))
      } else {
        this.form.setValidators(null)
      }
      this.form.updateValueAndValidity()
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

  get visibilityControl() {
    return this.form.controls['visibility']
  }

  fillInputs(user: User) {

    this.fc.bio.setValue(user.bio)
    this.fc.projectGoals.setValue(user.projectGoals)
    this.fc.websiteUrl.setValue(user.websiteUrl)
    this.fc.linkedinUrl.setValue(user.linkedinUrl)
    this.fc.githubUrl.setValue(user.githubUrl)
    this.fc.visibility.setValue(user.visibility)

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
    if (this.form.invalid) this.incorrectFields = true
    if (!this.currentUser || this.form.invalid) return

    this.isLoading = true
    this.isSubmitted = true
    
    const fv = this.form.value

    const GHUrl = this.ensureHttpOrHttps(fv.githubUrl)
    const LIUrl = this.ensureHttpOrHttps(fv.linkedinUrl)
    const websiteUrl = this.ensureHttpOrHttps(fv.websiteUrl)

    const updatedProfile = {
      id: this.currentUser.id,
      bio: fv.bio,
      projectGoals: fv.projectGoals,
      websiteUrl: websiteUrl,
      linkedinUrl: LIUrl,
      githubUrl: GHUrl,
      visibility: fv.visibility,
      techs: fv.techs
    }
        
    this.userService.update(updatedProfile).subscribe({
      next: (response) => {
        setTimeout(() => {
          this.isLoading = false
          this.router.navigate(['/dashboard/profile/' + this.currentUser.id])
        }, 1000)
      },
      error: (error) => {
        this.isLoading = false
        console.error(error)
      }
    })
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
