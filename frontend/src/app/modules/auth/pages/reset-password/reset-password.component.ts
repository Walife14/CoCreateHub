import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  isSubmitted = false;
  isLoading = false;

  form!: FormGroup;

  resetPasswordToken?: string;

  errorMessage?: string;
  resetSuccessMessage?: string;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]]
    })

    this.resetPasswordToken = this.activatedRoute.snapshot.params.token
  }

  get fc() {
    return this.form.controls
  }

  onSubmit() {
    if (this.form.invalid || !this.resetPasswordToken) return;
    this.isLoading = true
    
    this.authService.resetPassword(this.fc.password.value, this.resetPasswordToken).subscribe({
      next: (success) => {
        this.isLoading = false
        this.resetSuccessMessage = 'Successfully changed password! Redirecting to login...'
        setTimeout(() => {
          this.router.navigate(['/auth/login'])
        }, 3000)
      },
      error: (error) => {
        console.error("failed to change password!")
        this.isLoading = false
        this.errorMessage = error.error.error
      }
    })
  }

}
