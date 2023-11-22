import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { IUserRegister } from 'src/app/shared/interfaces/IUserRegister';
import { PasswordsMatchValidator } from 'src/app/shared/validators/password_match_validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  isLoading = false;
  errorMessage?: string;

  registerForm!: FormGroup;
  isSubmitted = false;
  returnUrl = ''

  constructor(
    private formBuilder: FormBuilder, private authService: AuthService,
    private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    }, {
      validators: PasswordsMatchValidator('password', 'confirmPassword')
    }),

    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl
  }

  get fc() {
    return this.registerForm.controls
  }

  onSubmit() {
    this.isSubmitted = true
    if (this.registerForm.invalid) return;
    this.isLoading = true

    const fv = this.registerForm.value

    const user: IUserRegister = {
      name: fv.name,
      email: fv.email,
      password: fv.password,
      confirmPassword: fv.confirmPassword
    }

    this.authService.register(user).subscribe({
      next: (response) => {
        this.isLoading = false
        if(this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl)
        } else {
          this.router.navigate(['/dashboard/home'])
        }
      },
      error: (error) => {
        console.log(error)
        this.isLoading = false
        this.errorMessage = error.error.error
      }
    })
  }


}
